import { useEffect, useRef } from "react"

// A ribbon that draws itself while the page scrolls: it enters from the left edge
// at the prices section, loops next to the steps and lands on the contact form.
// When the tip arrives, the form gets data-hit="true" (styled in global.css).
// Geometry is rebuilt from the live layout, so it follows any width and any
// height change above it (tabs, accordions, late fonts).

type Pt = [number, number]

const fmt = (v: number) => v.toFixed(1)

// Centripetal Catmull-Rom through the points, as cubic Bezier segments (no leading "M").
// startDir / endDir pin the tangent at the first / last point, so the run joins
// the circle without a kink.
function spline(pts: Pt[], startDir?: Pt, endDir?: Pt) {
  const p = [pts[0], ...pts, pts[pts.length - 1]]
  const gap = (a: Pt, b: Pt) => Math.max(1e-3, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])))
  let d = ""
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]]
    const d1 = gap(p0, p1)
    const d2 = gap(p1, p2)
    const d3 = gap(p2, p3)
    let c1 = [0, 1].map(
      (j) => (d1 * d1 * p2[j] - d2 * d2 * p0[j] + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1[j]) / (3 * d1 * (d1 + d2)),
    )
    let c2 = [0, 1].map(
      (j) => (d3 * d3 * p1[j] - d2 * d2 * p3[j] + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2[j]) / (3 * d3 * (d3 + d2)),
    )
    const third = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 3
    if (startDir && i === 1) c1 = [p1[0] + startDir[0] * third, p1[1] + startDir[1] * third]
    if (endDir && i === p.length - 3) c2 = [p2[0] - endDir[0] * third, p2[1] - endDir[1] * third]
    d += ` C${fmt(c1[0])},${fmt(c1[1])} ${fmt(c2[0])},${fmt(c2[1])} ${fmt(p2[0])},${fmt(p2[1])}`
  }
  return d
}

// Three quarters of an exact circle, clockwise on screen: right -> bottom -> left -> top.
function threeQuarterCircle(cx: number, cy: number, r: number) {
  const k = 0.5523 * r
  const c = (...v: number[]) => ` C${v.map(fmt).join(",")}`
  return (
    c(cx + r, cy + k, cx + k, cy + r, cx, cy + r) +
    c(cx - k, cy + r, cx - r, cy + k, cx - r, cy) +
    c(cx - r, cy - k, cx - k, cy - r, cx, cy - r)
  )
}

// The tip follows the scroll like a critically damped spring: it eases in and out
// on every wheel notch instead of darting forward and braking.
const SPRING = 7 // angular frequency, 1/s; settles in roughly 0.7 s
// Scroll needed per pixel of ribbon that does not go down (the loop, the sideways run).
// Going down, the tip moves 1:1 with the page, so it never races ahead of the reader.
const SIDEWAYS_RATE = 0.6

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
    let startY = 0 // relative to <main>
    let endY = 0 // form centre
    let keys = new Float32Array(2) // cumulative scroll "cost" along the path
    let current = 0
    let velocity = 0
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

      // The ribbon comes straight down into the right side of a true circle, runs
      // three quarters of it and leaves the top heading right, crossing its own descent.
      const start: Pt = [-70, pr.top + (desktop ? 90 : 30)]
      const entry: Pt = [cx + R, cy]
      const approach: Pt[] = desktop
        ? [start, [cl + cw * 0.14, pr.top + pr.height * 0.27], [cl + cw * 0.3, pr.top + pr.height * 0.66], entry]
        : [start, [W * 0.45, pr.top + pr.height * 0.3], entry]
      const exit: Pt[] = desktop
        ? [
            [cx, loopTop],
            [cx + R * 1.42, loopTop + drop * 0.085],
            [cl + cw * 0.56, loopTop + drop * 0.33],
            [cl + cw * 0.72, loopTop + drop * 0.44],
            [cl + cw * 0.855, loopTop + drop * 0.5],
            [cl + cw * 0.885, loopTop + drop * 0.66],
            [fx + cw * 0.045, fy - drop * 0.13],
            [fx, fy],
          ]
        : [[cx, loopTop], [cx + R * 1.3, loopTop + drop * 0.2], [W * 0.86, loopTop + drop * 0.6], [fx, fy]]
      const d =
        `M${fmt(start[0])},${fmt(start[1])}` +
        spline(approach, undefined, [0, 1]) +
        threeQuarterCircle(cx, cy, R) +
        spline(exit, [1, 0])

      const top = start[1] - 80
      const height = fy - top + 40
      svg!.setAttribute("width", String(W))
      svg!.setAttribute("height", String(height))
      svg!.setAttribute("viewBox", `0 ${top} ${W} ${height}`)
      svg!.style.top = `${top}px`
      grad!.setAttribute("y1", String(start[1]))
      grad!.setAttribute("y2", String(fy))
      path!.setAttribute("d", d)
      path!.setAttribute("stroke-width", String(stroke))
      path!.setAttribute("opacity", desktop ? "1" : "0.6")
      length = path!.getTotalLength()
      path!.style.strokeDasharray = `${length} ${length + stroke * 2}`
      startY = start[1]
      endY = f.top + f.height / 2 // land when the form is centred on screen

      const samples = Math.max(1, Math.ceil(length / 6))
      keys = new Float32Array(samples + 1)
      let prev = path!.getPointAtLength(0)
      for (let i = 1; i <= samples; i++) {
        const pt = path!.getPointAtLength((length * i) / samples)
        const ds = Math.hypot(pt.x - prev.x, pt.y - prev.y)
        keys[i] = keys[i - 1] + Math.max(pt.y - prev.y, SIDEWAYS_RATE * ds)
        prev = pt
      }
    }

    function target() {
      const mainTop = main!.getBoundingClientRect().top + window.scrollY
      const from = mainTop + startY - window.innerHeight * 0.66
      const to = mainTop + endY - window.innerHeight * 0.5
      const t = Math.max(0, Math.min(1, (window.scrollY - from) / (to - from)))
      // Find how much of the path this scroll position has "paid for".
      const last = keys.length - 1
      const key = t * keys[last]
      let lo = 0
      let hi = last
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1
        if (keys[mid] < key) lo = mid
        else hi = mid
      }
      const span = keys[hi] - keys[lo]
      return (lo + (span > 0 ? (key - keys[lo]) / span : 0)) / last
    }

    function apply() {
      path!.style.strokeDashoffset = String(length * (1 - current))
      path!.style.visibility = current <= 0.0005 ? "hidden" : "visible"
      form!.dataset.hit = current > 0.992 ? "true" : "false"
    }

    function tick(now: number) {
      const goal = target()
      const dt = Math.min(0.05, (now - (lastTime || now - 16)) / 1000)
      lastTime = now
      velocity += (SPRING * SPRING * (goal - current) - 2 * SPRING * velocity) * dt
      current += velocity * dt
      if (Math.abs(goal - current) < 0.0004 && Math.abs(velocity) < 0.002) {
        current = goal
        velocity = 0
      }
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
      velocity = 0
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
