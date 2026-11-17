import NumberFlow from "@number-flow/react"
import { Check } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { Dict } from "@/i18n/ru"
import { cn } from "@/lib/utils"

// Price list with checkboxes and a running estimate. Texts live in i18n (priceBuilder),
// prices and the "covered by" rule live here.
type Id = keyof Dict["priceBuilder"]["items"]

type Service = {
  id: Id
  kind: "month" | "once"
  price: number
  // When the service it points to is picked, this one is free and shown as "included".
  coveredBy?: Id
}

const SERVICES: Service[] = [
  { id: "google", kind: "month", price: 590 },
  { id: "seo", kind: "month", price: 690 },
  { id: "social", kind: "month", price: 490 },
  { id: "audit", kind: "once", price: 490, coveredBy: "google" },
  { id: "tracking", kind: "once", price: 390 },
  { id: "start", kind: "once", price: 290 },
]

type Text = { name: string; desc: string; inc?: string; incLine?: string; coveredDesc?: string }

const eur = { style: "currency", currency: "EUR", maximumFractionDigits: 0 } as const

export function PriceBuilder({
  t,
  locale,
  onSubmit,
}: {
  t: Dict["priceBuilder"]
  locale: string
  onSubmit: (ids: string[]) => void
}) {
  const [picked, setPicked] = useState<Id[]>(["google"])
  const text = (id: Id): Text => t.items[id]
  const fmt = (n: number) => new Intl.NumberFormat(locale, eur).format(n)
  const priceLabel = (s: Service) => fmt(s.price) + (s.kind === "month" ? t.perMonth : "")
  const isCovered = (s: Service) => !!s.coveredBy && picked.includes(s.coveredBy)
  const active = SERVICES.filter((s) => picked.includes(s.id) && !isCovered(s))
  const covered = SERVICES.filter(isCovered)
  const monthly = active.filter((s) => s.kind === "month").reduce((sum, s) => sum + s.price, 0)
  const once = active.filter((s) => s.kind === "once").reduce((sum, s) => sum + s.price, 0)
  const auditAlone = active.some((s) => s.id === "audit")
  const groups = [
    { kind: "month", legend: t.monthlyLegend },
    { kind: "once", legend: t.onceLegend },
  ] as const

  function toggle(id: Id) {
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <fieldset key={group.kind} className="flex flex-col gap-2">
            <legend className="mb-2 text-[13px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              {group.legend}
            </legend>
            {SERVICES.filter((s) => s.kind === group.kind).map((s) => {
              const tx = text(s.id)
              const cov = isCovered(s)
              const on = !cov && picked.includes(s.id)
              return (
                <label
                  key={s.id}
                  className={cn(
                    "relative flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-panel px-4 py-3.5 transition-colors sm:flex-nowrap sm:px-5 sm:py-4",
                    cov
                      ? "cursor-default border-dashed border-foreground/30"
                      : "cursor-pointer hover:border-foreground/30",
                    on && "border-primary bg-primary/6 hover:border-primary"
                  )}
                >
                  <input
                    type="checkbox"
                    className="peer absolute size-px opacity-0"
                    checked={on || cov}
                    disabled={cov}
                    onChange={() => toggle(s.id)}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-6 flex-none place-items-center rounded-sm border border-foreground/30 text-transparent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-primary",
                      on && "border-primary bg-primary text-primary-foreground",
                      cov && "border-primary text-primary"
                    )}
                  >
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-lg font-semibold">{tx.name}</span>
                    <span className="text-sm leading-snug text-muted-foreground">
                      {cov ? tx.coveredDesc : tx.desc}
                    </span>
                    {tx.inc && <span className="text-[13px] font-semibold text-primary">{tx.inc}</span>}
                  </span>
                  <span
                    className={cn(
                      "w-full pl-10 text-[17px] font-semibold whitespace-nowrap sm:w-auto sm:pl-0",
                      cov && "text-primary"
                    )}
                  >
                    {cov ? t.included : `${t.from} ${priceLabel(s)}`}
                  </span>
                </label>
              )
            })}
          </fieldset>
        ))}
      </div>

      <aside
        aria-live="polite"
        className="flex flex-col gap-3 rounded-lg border border-border bg-panel p-5 sm:p-7 lg:sticky lg:top-24"
      >
        <h3 className="text-[13px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {t.summary}
        </h3>
        {active.length === 0 ? (
          <p className="text-muted-foreground">{t.empty}</p>
        ) : (
          <ul className="flex flex-col gap-2 text-[15px]">
            {active.map((s) => {
              const tx = text(s.id)
              return (
                <li key={s.id} className="contents">
                  <span className="flex justify-between gap-3">
                    <span>{tx.name}</span>
                    <span className="whitespace-nowrap text-muted-foreground">{priceLabel(s)}</span>
                  </span>
                  {tx.incLine && (
                    <span className="flex justify-between gap-3">
                      <span>+ {tx.incLine}</span>
                      <span className="font-semibold text-primary">{t.included}</span>
                    </span>
                  )}
                </li>
              )
            })}
            {covered.map((s) => (
              <li key={s.id} className="flex justify-between gap-3">
                <span>+ {text(s.id).name}</span>
                <span className="font-semibold text-primary">{t.included}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="my-1 h-px bg-foreground/25" />

        {monthly > 0 && (
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] text-muted-foreground">{t.monthlyFrom}</span>
            <NumberFlow
              value={monthly}
              format={eur}
              locales={locale}
              className="text-[44px] leading-none font-extrabold tracking-tight text-violet tabular-nums"
            />
          </div>
        )}
        {once > 0 && (
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] text-muted-foreground">{t.onceFrom}</span>
            <NumberFlow
              value={once}
              format={eur}
              locales={locale}
              className="text-[32px] leading-none font-extrabold tracking-tight tabular-nums"
            />
          </div>
        )}
        {auditAlone && <p className="text-[13px] leading-snug text-primary">{t.auditNote}</p>}
        <p className="text-[13px] leading-snug text-muted-foreground">{t.budgetNote}</p>

        <Button size="lg" className="mt-1 h-12 text-base font-semibold" onClick={() => onSubmit(picked)}>
          {t.cta}
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-12 border-foreground/30 bg-transparent text-base font-semibold"
        >
          <a href="#contact" data-form="free">
            {t.more}
          </a>
        </Button>
      </aside>
    </div>
  )
}
