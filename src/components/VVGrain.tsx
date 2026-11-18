import { lazy, Suspense, useEffect, useRef, useState } from "react"

// The VV hero loads after the page itself and renders in a web worker on an
// OffscreenCanvas, so the main thread stays free. Browsers without WebGL in
// workers fall back to the React scene on the main thread.
const VVGrainScene = lazy(() => import("./VVGrainScene"))

const canOffscreen = () =>
  typeof window !== "undefined" &&
  typeof OffscreenCanvas !== "undefined" &&
  "transferControlToOffscreen" in HTMLCanvasElement.prototype

function WorkerScene({ onFail }: { onFail: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const worker = new Worker(new URL("./vvgrain.worker.ts", import.meta.url), { type: "module" })
    const tail = () => {
      const sky = canvas.closest(".sky")
      return sky ? parseFloat(getComputedStyle(sky).paddingBottom) || 0 : 0
    }
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let offscreen: OffscreenCanvas
    try {
      offscreen = canvas.transferControlToOffscreen()
    } catch {
      worker.terminate()
      onFail()
      return
    }
    worker.onmessage = (e) => {
      if (e.data?.type === "fail") {
        worker.terminate()
        onFail()
      }
    }
    worker.onerror = () => {
      worker.terminate()
      onFail()
    }
    worker.postMessage(
      {
        type: "init",
        canvas: offscreen,
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        tail: tail(),
        dpr: Math.min(window.devicePixelRatio || 1, 1.75),
        still,
      },
      [offscreen]
    )

    const onMove = (e: PointerEvent) =>
      worker.postMessage({
        type: "pointer",
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      })
    window.addEventListener("pointermove", onMove, { passive: true })
    const ro = new ResizeObserver(() =>
      worker.postMessage({ type: "resize", width: canvas.clientWidth, height: canvas.clientHeight, tail: tail() })
    )
    ro.observe(canvas)
    const io = new IntersectionObserver(([en]) => worker.postMessage({ type: "visible", visible: en.isIntersecting }))
    io.observe(canvas)
    return () => {
      window.removeEventListener("pointermove", onMove)
      ro.disconnect()
      io.disconnect()
      worker.terminate()
    }
  }, [onFail])
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%", pointerEvents: "none" }}
    />
  )
}

export function VVGrain() {
  const [mode, setMode] = useState<"wait" | "worker" | "main">("wait")
  useEffect(() => {
    let idle = 0
    const start = () => {
      const go = () => setMode(canOffscreen() ? "worker" : "main")
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(go, { timeout: 1500 })
        : window.setTimeout(go, 200)
    }
    if (document.readyState === "complete") start()
    else window.addEventListener("load", start, { once: true })
    return () => {
      window.removeEventListener("load", start)
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
    }
  }, [])
  if (mode === "wait") return null
  if (mode === "worker") return <WorkerScene key="w" onFail={fallback(setMode)} />
  return (
    <Suspense fallback={null}>
      <VVGrainScene />
    </Suspense>
  )
}

// Stable callback so the worker effect does not restart on re-render
const fallbacks = new WeakMap<object, () => void>()
function fallback(set: (m: "main") => void) {
  let f = fallbacks.get(set)
  if (!f) {
    f = () => set("main")
    fallbacks.set(set, f)
  }
  return f
}
