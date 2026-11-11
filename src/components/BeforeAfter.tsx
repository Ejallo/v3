// "Before and after" curve for the Technomodule SEO case.
// Only two points are measured (Search Console, July-August 2025 and 2026);
// the line between them is a schematic, so the chart carries no value axis.

const W = 800
const H = 360
const X0 = 40
const X1 = 760
const START = 231 // 14 Oct 2025 on a Jul 2025 - Aug 2026 axis
const Y_BEFORE = 250 // index 100
const Y_AFTER = 70 // index 169

const before = `M${X0},${Y_BEFORE} C100,246 170,254 ${START},248`
const after = `M${START},248 C330,240 420,200 520,150 S700,78 ${X1},${Y_AFTER}`
const area = `${after} L${X1},320 L${START},320 Z`

const pct = (x: number) => `${((x / W) * 100).toFixed(2)}%`

export function BeforeAfter() {
  return (
    <figure className="rounded-lg border border-border bg-card p-4 sm:p-7">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          role="img"
          aria-label="Схема: клики из поиска до начала работ и после. Июль–август 2026 к июлю–августу 2025: плюс 69 процентов."
        >
          <defs>
            <linearGradient id="ba-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--primary)" stopOpacity="0.28" />
              <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[70, 160, 250].map((y) => (
            <line key={y} x1={X0} x2={X1} y1={y} y2={y} stroke="var(--border)" strokeWidth="1" />
          ))}
          <line x1={X0} x2={X1} y1="320" y2="320" stroke="var(--input)" strokeWidth="1" />

          {/* Start of work */}
          <line
            x1={START} x2={START} y1="24" y2="320"
            stroke="var(--violet)" strokeWidth="1.5" strokeDasharray="4 6"
          />

          <path d={area} fill="url(#ba-fill)" />
          <path
            d={before} fill="none" stroke="var(--muted-foreground)"
            strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round"
          />
          <path d={after} fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />

          <circle cx={X0} cy={Y_BEFORE} r="7" fill="var(--card)" stroke="var(--muted-foreground)" strokeWidth="3" />
          <circle cx={X1} cy={Y_AFTER} r="8" fill="var(--primary)" />
          <circle cx={X1} cy={Y_AFTER} r="16" fill="var(--primary)" opacity="0.2" />
        </svg>

        {/* Labels are HTML so they stay readable when the chart scales down on phones */}
        <p
          className="absolute -translate-x-1/2 rounded-sm bg-violet px-2 py-1 text-[12px] leading-none font-semibold whitespace-nowrap text-background sm:text-[13px]"
          style={{ left: pct(START), top: 0 }}
        >
          начало работ · окт 2025
        </p>
        <p
          className="absolute text-right text-[clamp(28px,5vw,52px)] leading-none font-extrabold tracking-tight text-primary"
          style={{ top: "54%", right: "3%" }}
        >
          +69 %
        </p>
      </div>

      <div className="relative mt-2 h-5 text-[12px] text-muted-foreground sm:text-[13px]">
        <span className="absolute left-0">лето 2025</span>
        <span className="absolute right-0">лето 2026</span>
      </div>

      <figcaption className="mt-5 border-t border-border pt-4 text-[13px] leading-relaxed text-muted-foreground">
        <span className="mr-4 inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-0 w-6 border-t-[3px] border-dotted border-muted-foreground" />
          до
        </span>
        <span className="mr-4 inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-[3px] w-6 rounded-full bg-primary" />
          после
        </span>
        <span className="whitespace-nowrap">Search Console, лето 2025 и лето 2026</span>
      </figcaption>
    </figure>
  )
}
