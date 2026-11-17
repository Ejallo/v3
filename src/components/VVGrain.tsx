import { lazy, Suspense, useEffect, useState } from "react"

// The 3D scene (three.js, ~240 KB gz) loads only after the page itself has
// loaded and the browser is idle, so text and buttons come first.
const VVGrainScene = lazy(() => import("./VVGrainScene"))

export function VVGrain() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let idle = 0
    const start = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setReady(true), { timeout: 1500 })
        : window.setTimeout(() => setReady(true), 200)
    }
    if (document.readyState === "complete") start()
    else window.addEventListener("load", start, { once: true })
    return () => {
      window.removeEventListener("load", start)
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
    }
  }, [])
  if (!ready) return null
  return (
    <Suspense fallback={null}>
      <VVGrainScene />
    </Suspense>
  )
}
