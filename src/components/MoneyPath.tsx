import type { Dict } from "@/i18n/ru"

// "Spent -> earned" block for the online-store Google Ads case (ROAS 1316 %).
// Euro figures are converted from hryvnia at the NBU rate of 12 Nov 2026 (50.48 UAH per EUR).

const label = "text-[13px] font-semibold tracking-[0.1em] uppercase text-muted-foreground sm:text-[15px]"

export function MoneyPath({ t }: { t: Dict["money"] }) {
  return (
    <div className="flex flex-col gap-9 sm:gap-12">
      <p className="text-[15px] text-muted-foreground">{t.meta}</p>

      <div className="flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-8">
        <div className="flex flex-col gap-3">
          <span className={label}>{t.spent.label}</span>
          <span className="text-[clamp(40px,4.4vw,64px)] leading-none font-extrabold tracking-[-0.03em] whitespace-nowrap">
            {t.spent.value}
          </span>
        </div>
        <div
          className="-my-2 flex rotate-90 flex-col items-center gap-1 text-xl font-extrabold text-(--ribbon-to) sm:my-0 sm:rotate-0 sm:pb-2"
          aria-hidden="true"
        >
          <span>{t.ratio}</span>
          <svg width="96" height="24" viewBox="0 0 96 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h88M82 4l8 8-8 8" />
          </svg>
        </div>
        <div className="flex flex-col gap-3 sm:flex-[1_1_360px]">
          <span className={label}>{t.returned.label}</span>
          <span className="text-[clamp(64px,9vw,128px)] leading-[0.9] font-extrabold tracking-[-0.04em] whitespace-nowrap text-violet">
            {t.returned.value}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 rounded-sm bg-(--ribbon-from) px-6 py-7 text-white sm:px-10 sm:py-9">
        <div>
          <span className="mb-1.5 block text-lg font-semibold opacity-85">{t.band.kicker}</span>
          <span className="text-[clamp(36px,4vw,56px)] leading-none font-extrabold tracking-[-0.03em] whitespace-nowrap">
            {t.band.big}
          </span>
        </div>
        <p className="max-w-[380px] text-lg leading-normal">
          {t.band.before}
          <strong>{t.band.strong}</strong>
          {t.band.after}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <p className="text-base text-muted-foreground">
          <strong className="text-foreground">{t.stats.orders}</strong>
          {t.stats.mid}
          <strong className="text-foreground">{t.stats.cpa}</strong>
          {t.stats.rest}
        </p>
        <a
          href="#contact"
          className="inline-flex min-h-13 items-center rounded-sm bg-primary px-7 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary"
        >
          {t.cta}
        </a>
      </div>

      <p className="max-w-[860px] text-[13px] leading-relaxed text-muted-foreground">{t.note}</p>
    </div>
  )
}
