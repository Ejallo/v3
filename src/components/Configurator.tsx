import NumberFlow from "@number-flow/react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { Dict } from "@/i18n/ru"

export type Selection = {
  monthly: string[]
  once: string[]
  pilot: boolean
  budget: number
}

// Prices are the "from" figures of the price grid. Nothing here is an estimate of results.
const MONTHLY = [
  { id: "google", from: 590 },
  { id: "seo", from: 600 },
  { id: "social", from: null },
] as const

const ONCE = [
  { id: "audit", price: 490 },
  { id: "tracking", price: 390 },
  { id: "gstart", price: 290 },
] as const

const chip =
  "h-10 rounded-sm border border-foreground/30 px-3.5 text-[15px] font-medium text-foreground hover:bg-foreground/5 hover:text-foreground aria-pressed:bg-primary data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground"

const eur = { style: "currency", currency: "EUR", maximumFractionDigits: 0 } as const

export function Configurator({
  t,
  locale,
  value,
  onChange,
  onSubmit,
}: {
  t: Dict["configurator"]
  locale: string
  value: Selection
  onChange: (next: Selection) => void
  onSubmit: () => void
}) {
  const base = MONTHLY.reduce(
    (sum, s) => (value.monthly.includes(s.id) && s.from ? sum + s.from : sum),
    0
  )
  const monthly = value.pilot ? Math.round((base * 2) / 3) : base
  const once = ONCE.reduce(
    (sum, s) => (value.once.includes(s.id) ? sum + s.price : sum),
    0
  )
  const hasAds = value.monthly.includes("google") || value.monthly.includes("social")
  const hasSocial = value.monthly.includes("social")
  const nothing = value.monthly.length === 0 && value.once.length === 0

  return (
    <div className="relative rounded-lg border border-border bg-panel p-5 text-foreground sm:p-7">
      <p className="text-sm font-medium text-muted-foreground">{t.hint}</p>

      <div className="mt-5 space-y-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{t.monthlyLegend}</legend>
          <ToggleGroup
            type="multiple"
            value={value.monthly}
            onValueChange={(monthly) => onChange({ ...value, monthly })}
            className="flex w-full flex-wrap"
            spacing={2}
          >
            {MONTHLY.map((s) => (
              <ToggleGroupItem key={s.id} value={s.id} className={chip}>
                {t.labels[s.id]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{t.onceLegend}</legend>
          <ToggleGroup
            type="multiple"
            value={value.once}
            onValueChange={(once) => onChange({ ...value, once })}
            className="flex w-full flex-wrap"
            spacing={2}
          >
            {ONCE.map((s) => (
              <ToggleGroupItem key={s.id} value={s.id} className={chip}>
                {t.labels[s.id]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </fieldset>

        {hasAds && (
          <div>
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <label htmlFor="budget" className="text-sm font-semibold">
                {t.budget}
              </label>
              <NumberFlow
                value={value.budget}
                format={eur}
                locales={locale}
                className="text-base font-semibold tabular-nums"
              />
            </div>
            <Slider
              id="budget"
              aria-label={t.budget}
              min={500}
              max={5000}
              step={100}
              value={[value.budget]}
              onValueChange={([budget]) => onChange({ ...value, budget })}
            />
            <p className="mt-2 text-[13px] text-muted-foreground">{t.budgetNote}</p>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-6 border-t border-foreground/25 pt-5">
        <div>
          <p className="text-[13px] text-muted-foreground">{t.monthlyFrom}</p>
          <NumberFlow
            value={monthly}
            format={eur}
            locales={locale}
            className="text-[40px] leading-none font-extrabold tracking-tight text-violet tabular-nums sm:text-[56px]"
          />
        </div>
        <div>
          <p className="text-[13px] text-muted-foreground">{t.onceFrom}</p>
          <NumberFlow
            value={once}
            format={eur}
            locales={locale}
            className="text-[40px] leading-none font-extrabold tracking-tight tabular-nums sm:text-[56px]"
          />
        </div>
      </div>

      <ul className="mt-3 space-y-1 text-[13px] leading-snug text-muted-foreground">
        {nothing && <li>{t.noteNothing}</li>}
        {hasSocial && <li>{t.noteSocial}</li>}
        {value.once.includes("audit") && base > 0 && <li>{t.noteAudit}</li>}
        {value.once.includes("tracking") && <li>{t.noteTracking}</li>}
      </ul>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button size="lg" className="h-12 px-5 text-base font-semibold" onClick={onSubmit}>
          {t.cta}
        </Button>
        <Toggle
          pressed={value.pilot}
          onPressedChange={(pilot) => onChange({ ...value, pilot })}
          className={chip + " h-12 justify-start whitespace-normal text-left text-[13px] leading-tight"}
        >
          {t.pilot}
        </Toggle>
      </div>
      {value.pilot && <p className="mt-2 text-[13px] text-muted-foreground">{t.pilotNote}</p>}
    </div>
  )
}
