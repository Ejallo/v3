// Chart mock-ups for the cases page (CasesPage.tsx).
import type { CaseChart } from "@/i18n/ru"

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
