import { useRef, useState } from "react"

import { base } from "@/components/SiteChrome"
import type { CaseChart, Dict } from "@/i18n/ru"

type Results = Dict["results"]
type Chart = CaseChart

const W = 480
const BASE = 262
const TOP = 220

function Bars({ bars }: { bars: Extract<Chart, { kind: "bars" }>["bars"] }) {
  const n = bars.length
  const w = n > 2 ? 72 : 108
  const gap = (W - n * w) / (n + 1)
  const max = Math.max(...bars.map((b) => b.value))
  return (
    <>
      {bars.map((b, j) => {
        const h = (TOP * b.value) / max
        const x = gap + j * (w + gap)
        const cx = x + w / 2
        return (
          <g key={b.label}>
            <rect
              className={b.muted ? "cases-bar cases-bar-muted" : "cases-bar"}
              x={x}
              y={BASE - h}
              width={w}
              height={h}
            />
            <text className="cases-late" x={cx} y={BASE - h - 12} textAnchor="middle" fontSize="17">
              {b.text}
            </text>
            <text className="cases-axis" x={cx} y="286" textAnchor="middle" fontSize={n > 2 ? 12.5 : 14}>
              {b.label}
            </text>
          </g>
        )
      })}
    </>
  )
}

// Schematic cumulative curve: only the end value is real, there is no value axis.
function Curve({ end }: { end: string }) {
  const pts = Array.from({ length: 25 }, (_, k) => {
    const t = k / 24
    return [24 + t * 400, 256 - 205 * (0.55 * t + 0.45 * Math.pow(t, 2.4))]
  })
  const d = pts.map((p, k) => `${k ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ")
  const [ex, ey] = pts[pts.length - 1]
  return (
    <>
      <path className="cases-area" d={`${d} L${ex} ${BASE} L24 ${BASE} Z`} fill="url(#cases-fade)" />
      <path className="cases-line" pathLength={1} d={d} />
      <g className="cases-late">
        <circle className="cases-dot" cx={ex} cy={ey} r="7" />
        <text x={ex + 6} y={ey - 16} textAnchor="end" fontSize="22">
          {end}
        </text>
      </g>
    </>
  )
}

// Search positions before -> after for a few queries; position 1 is on the left.
function Ranks({ rows }: { rows: Extract<Chart, { kind: "ranks" }>["rows"] }) {
  const x0 = 176
  const x1 = 460
  const px = (pos: number) => x0 + ((pos - 1) / 9) * (x1 - x0)
  const fmt = (n: number) => String(n).replace(".", ",")
  return (
    <>
      {[1, 3, 5, 7, 10].map((p) => (
        <g key={p}>
          <line className="cases-grid" x1={px(p)} x2={px(p)} y1="18" y2={BASE} />
          <text className="cases-axis" x={px(p)} y="286" textAnchor="middle" fontSize="13">
            {p === 1 ? "TOP-1" : p}
          </text>
        </g>
      ))}
      {rows.map((r, j) => {
        const y = 44 + j * 46
        return (
          <g key={r.label}>
            <text className="cases-axis" x={x0 - 14} y={y + 5} textAnchor="end" fontSize="13.5">
              {r.label}
            </text>
            <line
              className="cases-move"
              pathLength={1}
              x1={px(r.from)}
              x2={px(r.to)}
              y1={y}
              y2={y}
              style={{ animationDelay: `${0.2 + j * 0.08}s` }}
            />
            <circle className="cases-from" cx={px(r.from)} cy={y} r="6" />
            <circle className="cases-dot cases-late" cx={px(r.to)} cy={y} r="8" />
            <text className="cases-late" x={px(r.to) - 14} y={y + 5} textAnchor="end" fontSize="14">
              {fmt(r.to)}
            </text>
          </g>
        )
      })}
    </>
  )
}

export function ChartScreen({ chart }: { chart: Chart }) {
  return (
    <div className="cases-screen">
      <div className="cases-screen-top">{chart.title}</div>
      <svg viewBox={`0 0 ${W} 300`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="cases-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--violet)" stopOpacity=".38" />
            <stop offset="1" stopColor="var(--violet)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[60, 120, 180, 240].map((y) => (
          <line key={y} className="cases-grid" x1="0" x2={W} y1={y} y2={y} />
        ))}
        <line className="cases-base" x1="0" x2={W} y1={BASE} y2={BASE} />
        {chart.kind === "bars" && <Bars bars={chart.bars} />}
        {chart.kind === "curve" && <Curve end={chart.end} />}
        {chart.kind === "ranks" && <Ranks rows={chart.rows} />}
      </svg>
    </div>
  )
}

export function Cases({ t }: { t: Results }) {
  const n = t.cases.length
  const [i, setI] = useState(0)
  // Bumped on every change so the slide and the progress bar restart their animations.
  const [run, setRun] = useState(0)
  const touchX = useRef<number | null>(null)

  const go = (k: number) => {
    setI(((k % n) + n) % n)
    setRun((r) => r + 1)
  }
  const c = t.cases[i]

  return (
    <div className="cases">
      <div
        className="cases-card"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (Math.abs(dx) > 48) go(dx < 0 ? i + 1 : i - 1)
        }}
      >
        <div className="cases-body" key={run} aria-live="polite">
          <div className="cases-left">
            <div className="cases-head">
              <span className="cases-chip">{c.channel}</span>
              <span className="cases-who">{c.client}</span>
            </div>
            <p className={c.small ? "cases-fig cases-fig-small" : "cases-fig"}>{c.figure}</p>
            <h3 className="cases-metric">{c.metric}</h3>
            <p className="cases-text">{c.text}</p>
          </div>
          <ChartScreen chart={c.chart} />
        </div>

        <div className="cases-foot">
          <div className="cases-segs">
            {t.cases.map((item, k) => (
              <button
                key={item.figure}
                type="button"
                aria-label={`${k + 1} / ${n}`}
                aria-current={k === i ? "true" : undefined}
                onClick={() => go(k)}
              >
                <span className="cases-seg">
                  <i
                    key={k === i ? run : "idle"}
                    className={k === i ? "cases-prog" : undefined}
                    data-done={k < i ? "true" : undefined}
                    onAnimationEnd={k === i ? () => go(i + 1) : undefined}
                  />
                </span>
              </button>
            ))}
          </div>
          <div className="cases-arrows">
            <button type="button" aria-label={t.prev} onClick={() => go(i - 1)}>
              ←
            </button>
            <button type="button" aria-label={t.next} onClick={() => go(i + 1)}>
              →
            </button>
          </div>
          <a className="cases-all" href={base + t.all.href}>
            {t.all.label} →
          </a>
        </div>
      </div>
      <p className="cases-note">{t.note}</p>
    </div>
  )
}
