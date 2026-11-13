import { useEffect, useRef } from "react"

// A ribbon that draws itself while the page scrolls: it enters from the left edge
// at the prices section, loops next to the steps and lands on the contact form.
// When the tip arrives, the form gets data-hit="true" (styled in global.css).
// Geometry is rebuilt from the live layout, so it follows any width and any
// height change above it (tabs, accordions, late fonts).

type Pt = [number, number]

// Centripetal Catmull-Rom through the points, written as cubic Bezier segments.
function splinePath(pts: Pt[]) {
  const p = [pts[0], ...pts, pts[pts.length - 1]]
  const gap = (a: Pt, b: Pt) => Math.max(1e-3, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])))
  const n = (v: number) => v.toFixed(1)
  let d = `M${n(pts[0][0])},${n(pts[0][1])}`
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]]
    const d1 = gap(p0, p1)
    const d2 = gap(p1, p2)
    const d3 = gap(p2, p3)
    const c1 = [0, 1].map(
      (j) => (d1 * d1 * p2[j] - d2 * d2 * p0[j] + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1[j]) / (3 * d1 * (d1 + d2)),
    )
    const c2 = [0, 1].map(
      (j) => (d3 * d3 * p1[j] - d2 * d2 * p3[j] + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2[j]) / (3 * d3 * (d3 + d2)),
    )
    d += ` C${n(c1[0])},${n(c1[1])} ${n(c2[0])},${n(c2[1])} ${n(p2[0])},${n(p2[1])}`
  }
  return d
}

const LOOP_ANGLES = [32, 72, 112, 150, 188, 228, 268]
const FOLLOW_MS = 260 // how long the tip takes to catch up with the scroll position

export function ScrollRibbon() {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const gradRef = useRef<SVGLinearGradientElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    const path = pathRef.current
    const grad = gradRef.current
    const main = svg?.parentElement
    const prices = document.getElementById("prices")
    const steps = document.getElementById("steps")
    const form = document.querySelector<HTMLFormElement>("#contact form")
    if (!svg || !path || !grad || !main || !prices || !steps || !form) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    let length = 0
    let startY = 0 // tops relative to <main>
    let endY = 0
    let current = 0
    let frame = 0
    let lastTime = 0

    const box = (el: Element) => {
      const m = main.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      return { top: r.top - m.top, left: r.left - m.left, width: r.width, height: r.height }
    }

    function layout() {
      const W = main!.clientWidth
      const pr = box(prices!)
      const sp = box(steps!)
      const f = box(form!)
      const desktop = W >= 1024
      const cw = Math.min(1240, W) - (W >= 640 ? 64 : 32) // content width, as in Landing's `wrap`
      const cl = (W - cw) / 2
      const stroke = desktop ? Math.max(18, Math.min(40, W * 0.016)) : 8

      const R = desktop ? Math.min(cw * 0.2, sp.height * 0.36) : W * 0.3
      const cx = desktop ? cl + cw * 0.155 : W * 0.42
      const cy = sp.top + sp.height * (desktop ? 0.74 : 0.62)
      const fx = f.left + f.width * 0.6
      const fy = f.top + 2
      const loopTop = cy - R
      const drop = fy - loopTop

      // The loop is a slightly tilted oval, so it reads as a pen stroke, not a compass circle.
      const tilt = (-12 * Math.PI) / 180
      const onLoop = (deg: number): Pt => {
        const t = (deg * Math.PI) / 180
        const x = R * 1.04 * Math.cos(t)
        const y = R * 0.97 * Math.sin(t)
        return [cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]
      }

      const pts: Pt[] = [[-70, pr.top + (desktop ? 90 : 30)]]
      if (desktop) {
        pts.push(
          [cl + cw * 0.1, pr.top + pr.height * 0.3],
          [cl + cw * 0.235, pr.top + pr.height * 0.66],
          [cl + cw * 0.3, sp.top + sp.height * 0.1],
        )
      } else {
        pts.push([W * 0.45, pr.top + pr.height * 0.3], [W * 0.72, sp.top + sp.height * 0.1])
      }
      for (const deg of LOOP_ANGLES) pts.push(onLoop(deg))
      if (desktop) {
        pts.push(
          [cx + R * 1.42, loopTop + drop * 0.085],
          [cl + cw * 0.56, loopTop + drop * 0.33],
          [cl + cw * 0.72, loopTop + drop * 0.44],
          [cl + cw * 0.855, loopTop + drop * 0.5],
          [cl + cw * 0.885, loopTop + drop * 0.66],
          [fx + cw * 0.045, fy - drop * 0.13],
          [fx, fy],
        )
      } else {
        pts.push([cx + R * 1.3, loopTop + drop * 0.2], [W * 0.86, loopTop + drop * 0.6], [fx, fy])
      }

      const top = pts[0][1] - 80
      const height = fy - top + 40
      svg!.setAttribute("width", String(W))
      svg!.setAttribute("height", String(height))
      svg!.setAttribute("viewBox", `0 ${top} ${W} ${height}`)
      svg!.style.top = `${top}px`
      grad!.setAttribute("y1", String(pts[0][1]))
      grad!.setAttribute("y2", String(fy))
      path!.setAttribute("d", splinePath(pts))
      path!.setAttribute("stroke-width", String(stroke))
      path!.setAttribute("opacity", desktop ? "1" : "0.6")
      length = path!.getTotalLength()
      path!.style.strokeDasharray = `${length} ${length + stroke * 2}`
      startY = pr.top
      endY = f.top
    }

    function target() {
      const mainTop = main!.getBoundingClientRect().top + window.scrollY
      const from = mainTop + startY - window.innerHeight * 0.72
      const to = mainTop + endY - window.innerHeight * 0.42
      const t = Math.max(0, Math.min(1, (window.scrollY - from) / (to - from)))
      return t * t * (3 - 2 * t) * 0.35 + t * 0.65 // soft start and soft landing
    }

    function apply() {
      path!.style.strokeDashoffset = String(length * (1 - current))
      path!.style.visibility = current <= 0.0005 ? "hidden" : "visible"
      form!.dataset.hit = current > 0.992 ? "true" : "false"
    }

    function tick(now: number) {
      const goal = target()
      const dt = Math.min(64, now - (lastTime || now))
      lastTime = now
      current += (goal - current) * (1 - Math.exp(-dt / FOLLOW_MS))
      if (Math.abs(goal - current) < 0.0004) current = goal
      apply()
      if (current === goal) {
        frame = 0
        lastTime = 0
      } else {
        frame = requestAnimationFrame(tick)
      }
    }

    const jump = () => {
      current = target()
      apply()
    }
    const onScroll = () => {
      // No easing when motion is reduced or the page is in the background (frames barely run there).
      if (reduce.matches || document.hidden) jump()
      else if (!frame) frame = requestAnimationFrame(tick)
    }
    const relayout = () => {
      layout()
      jump()
    }

    relayout()
    const observer = new ResizeObserver(relayout)
    observer.observe(main)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", relayout)
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", relayout)
      if (frame) cancelAnimationFrame(frame)
      delete form.dataset.hit
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 z-0 overflow-visible"
    >
      <defs>
        <linearGradient ref={gradRef} id="ribbon-gradient" gradientUnits="userSpaceOnUse" x1="0" x2="0">
          <stop offset="0" stopColor="var(--ribbon-from)" />
          <stop offset="1" stopColor="var(--ribbon-to)" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        fill="none"
        stroke="url(#ribbon-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ visibility: "hidden" }}
      />
    </svg>
  )
}
