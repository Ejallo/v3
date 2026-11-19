import { useEffect, useRef, useState } from "react"

import { DICT, homeOf, type Lang } from "@/components/SiteChrome"
import type { Dict } from "@/i18n/ru"
import "@/styles/cases-cards.css"

// Cases block: three colored cards with a laptop mock-up fit the row; the rest scroll in with the arrows.
// Texts come from i18n (results.cards); colors and chart shapes are per card index here.
type Card = Dict["results"]["cards"][number] & {
  points: number[]
  bg: string
  fg: string
  line: string
}

const LOOKS = [
  { points: [8, 12, 11, 20, 26, 34, 45, 58, 66, 82, 100], bg: "#a59cff", fg: "#1a1640", line: "#5b4fe0" },
  { points: [10, 18, 24, 30, 38, 47, 55, 66, 74, 88, 100], bg: "#5dcaa5", fg: "#04342c", line: "#0f9d6b" },
  { points: [20, 24, 22, 30, 36, 42, 55, 63, 74, 86, 100], bg: "#85b7eb", fg: "#042c53", line: "#1a73e8" },
]

const W = 200
const H = 80
const GROW_MS = 1600

function Chart({ points }: { points: number[] }) {
  const n = points.length - 1
  const pts = points.map((v, i) => [(i * W) / n, H - ((v * H) / 100) * 0.92 - 2])
  const line = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")
  const [lx, ly] = pts[n]
  return (
    <span className="tm-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <line className="tm-grid" x1="0" x2={W} y1={H * 0.35} y2={H * 0.35} />
        <line className="tm-grid" x1="0" x2={W} y1={H * 0.7} y2={H * 0.7} />
        <g className="tm-grow">
          <polygon className="tm-area" points={`0,${H} ${line} ${W},${H}`} />
          <polyline className="tm-line" vectorEffect="non-scaling-stroke" points={line} />
        </g>
        <circle className="tm-dot" cx={lx} cy={ly} r="3.5" />
      </svg>
    </span>
  )
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Counts the number inside `text` (e.g. "3 628 284 ₴", "71.876 €", "+69 %") from 0 while `play` is on. */
function Counter({ text, play }: { text: string; play: boolean }) {
  const m = text.match(/^(\D*?)(\d(?:[\d\s.]*\d)?)(\D*)$/)
  const target = m ? Number(m[2].replace(/[\s.]/g, "")) : 0
  // Keep the thousands separator of the source text (a space, a no-break space or "."); none = no grouping.
  const sep = m?.[2].match(/\D/)?.[0] ?? ""
  // Idle state shows the final number; a hover replays the count from 0.
  const animate = play && !!m && !reducedMotion()
  const [v, setV] = useState(animate ? 0 : target)

  useEffect(() => {
    if (!animate) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / GROW_MS)
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [play, animate, target])

  if (!m) return <>{text}</>
  const num = sep ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, sep) : String(v)
  return (
    <>
      {m[1]}
      {num}
      {m[3]}
    </>
  )
}

function CaseCard({ c, href }: { c: Card; href: string }) {
  // The chart is drawn in full by default. Every hover bumps `run`, which remounts
  // the chart and the counter so the growth replays once from 0.
  const [run, setRun] = useState(0)
  const play = run > 0

  return (
    <a
      className={play ? "tm-case is-play" : "tm-case"}
      href={href}
      onPointerEnter={(e) => e.pointerType === "mouse" && setRun((r) => r + 1)}
      style={{ "--bg": c.bg, "--fg": c.fg, "--line": c.line } as React.CSSProperties}
    >
      <span className="tm-case__tag">{c.tag}</span>
      <span className="tm-case__num">{c.num}</span>
      <span className="tm-case__txt">{c.txt}</span>
      <span className="tm-laptop">
        <span className="tm-laptop__screen">
          <span className="tm-laptop__bar">
            <i />
            <i />
            <i />
          </span>
          <span className="tm-laptop__lab">{c.lab}</span>
          <span className="tm-laptop__val">
            <Counter key={run} text={c.val} play={play} />
          </span>
          <Chart key={run} points={c.points} />
        </span>
        <span className="tm-laptop__base" />
      </span>
    </a>
  )
}

export function CasesCards({
  lang,
  title,
  titleClass,
}: {
  lang: Lang
  title: string
  titleClass?: string
}) {
  const t = DICT[lang].results
  const cards: Card[] = t.cards.map((c, i) => ({ ...c, ...LOOKS[i % LOOKS.length] }))
  const track = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const href = `${homeOf(lang)}cases/`

  useEffect(() => {
    const el = track.current
    if (!el) return
    const upd = () =>
      setEdge({
        start: el.scrollLeft < 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      })
    upd()
    el.addEventListener("scroll", upd, { passive: true })
    window.addEventListener("resize", upd)
    return () => {
      el.removeEventListener("scroll", upd)
      window.removeEventListener("resize", upd)
    }
  }, [])

  const scroll = (dir: number) => {
    const el = track.current
    const card = el?.querySelector<HTMLElement>(".tm-case")
    if (el && card) el.scrollBy({ left: (card.offsetWidth + 16) * dir, behavior: "smooth" })
  }

  return (
    <div className="tm-cases">
      <div className="tm-cases__head">
        <h2 className={titleClass}>{title}</h2>
        <div className="tm-cases__actions">
          <a className="tm-cases__allbtn" href={href}>
            {t.allShort}
          </a>
          <div className="tm-cases__arrows">
            <button className="tm-cases__arrow" type="button" aria-label={t.prev} disabled={edge.start} onClick={() => scroll(-1)}>
              ←
            </button>
            <button className="tm-cases__arrow" type="button" aria-label={t.next} disabled={edge.end} onClick={() => scroll(1)}>
              →
            </button>
          </div>
        </div>
      </div>

      <div className="tm-cases__track" ref={track}>
        {cards.map((c) => (
          <CaseCard key={c.num} c={c} href={href} />
        ))}

        <a className="tm-case tm-case--all" href={href}>
          <span className="tm-case__go">→</span>
          <span className="tm-case__all">{t.all.label}</span>
        </a>
      </div>
    </div>
  )
}
