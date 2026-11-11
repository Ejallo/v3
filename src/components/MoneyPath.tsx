import type { Dict } from "@/i18n/ru"

// "Money path" for the online-store Google Ads case.
// The stream is drawn to scale: the right end is 13.16 times thicker than the left,
// the same ratio as conversion value to ad spend.
// Euro figures are converted from hryvnia at the NBU rate of 12 Nov 2026 (50.4823 UAH per EUR).

const W = 1000
const H = 240
const MID = H / 2
const THIN = 14
const WIDE = THIN * 13.16
const A = 300 // where the stream starts to widen
const B = 700 // where it reaches full width

const top = (h: number) => MID - h / 2
const bottom = (h: number) => MID + h / 2

const stream = [
  `M0,${top(THIN)}`,
  `L${A},${top(THIN)}`,
  `C${A + 180},${top(THIN)} ${B - 180},${top(WIDE)} ${B},${top(WIDE)}`,
  `L${W},${top(WIDE)}`,
  `L${W},${bottom(WIDE)}`,
  `L${B},${bottom(WIDE)}`,
  `C${B - 180},${bottom(WIDE)} ${A + 180},${bottom(THIN)} ${A},${bottom(THIN)}`,
  `L0,${bottom(THIN)}`,
  "Z",
].join(" ")

const label = "text-[13px] text-muted-foreground sm:text-[15px]"
const sub = "mt-1.5 text-[12px] text-muted-foreground sm:text-[13px]"

export function MoneyPath({ t }: { t: Dict["money"] }) {
  return (
    <figure>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={t.aria}>
          <defs>
            <linearGradient id="mp-stream" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--violet)" />
              <stop offset="0.45" stopColor="var(--violet)" />
              <stop offset="1" stopColor="var(--primary)" />
            </linearGradient>
          </defs>
          <path d={stream} fill="url(#mp-stream)" />
          <line
            x1={(A + B) / 2} x2={(A + B) / 2} y1="8" y2={H - 8}
            stroke="var(--foreground)" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 7"
          />
        </svg>
        <p
          className="absolute top-1/2 -translate-y-1/2 text-[clamp(30px,6.4vw,84px)] leading-none font-extrabold tracking-[-0.04em] text-primary-foreground"
          style={{ right: "4%" }}
        >
          {t.ratio}
        </p>
      </div>

      <ol className="mt-5 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)] gap-x-3 sm:mt-7 sm:gap-x-8">
        <li>
          <p className={label}>{t.spent.label}</p>
          <p className="mt-1 text-[clamp(19px,3.2vw,40px)] leading-none font-extrabold tracking-tight whitespace-nowrap text-violet">
            {t.spent.value}
          </p>
          <p className={sub}>{t.spent.sub}</p>
        </li>
        <li>
          <p className={label}>{t.orders.label}</p>
          <p className="mt-1 text-[clamp(19px,3.2vw,40px)] leading-none font-extrabold tracking-tight whitespace-nowrap">
            {t.orders.value}
          </p>
        </li>
        <li className="text-right">
          <p className={label}>{t.returned.label}</p>
          <p className="mt-1 text-[clamp(22px,4.4vw,56px)] leading-none font-extrabold tracking-tight whitespace-nowrap text-primary">
            {t.returned.value}
          </p>
          <p className={sub}>{t.returned.sub}</p>
        </li>
      </ol>

      <dl className="mt-7 grid grid-cols-1 border-t border-foreground/25 sm:grid-cols-3 sm:gap-x-8">
        {t.derived.map((item) => (
          <div
            key={item.label}
            className="flex items-baseline justify-between gap-4 border-b border-border py-3.5 sm:block sm:border-b-0"
          >
            <dt className="text-[15px] text-muted-foreground">{item.label}</dt>
            <dd className="text-xl font-extrabold tracking-tight whitespace-nowrap sm:mt-1 sm:text-2xl">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <figcaption className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
        {t.caption}
      </figcaption>
    </figure>
  )
}
