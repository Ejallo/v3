import NumberFlow from "@number-flow/react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type Selection = {
  monthly: string[]
  once: string[]
  pilot: boolean
  budget: number
}

// Prices are the "from" figures of the price grid. Nothing here is an estimate of results.
const MONTHLY = [
  { id: "google", label: "Google Ads", from: 590 },
  { id: "seo", label: "SEO и GEO", from: 600 },
  { id: "social", label: "Meta · TikTok · Telegram", from: null },
] as const

const ONCE = [
  { id: "audit", label: "Аудит", price: 490 },
  { id: "tracking", label: "Трекинг", price: 390 },
  { id: "gstart", label: "Google-Старт", price: 290 },
] as const

const chip =
  "h-10 rounded-sm border border-foreground/30 px-3.5 text-[15px] font-medium text-foreground hover:bg-foreground/5 hover:text-foreground aria-pressed:bg-primary data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground"

const eur = { style: "currency", currency: "EUR", maximumFractionDigits: 0 } as const

export function Configurator({
  value,
  onChange,
  onSubmit,
}: {
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
    <div className="relative rounded-lg border border-border bg-card p-5 text-foreground sm:p-7">
      <p className="text-sm font-medium text-muted-foreground">
        Соберите задачу — цена посчитается сразу
      </p>

      <div className="mt-5 space-y-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Каждый месяц</legend>
          <ToggleGroup
            type="multiple"
            value={value.monthly}
            onValueChange={(monthly) => onChange({ ...value, monthly })}
            className="flex w-full flex-wrap"
            spacing={2}
          >
            {MONTHLY.map((s) => (
              <ToggleGroupItem key={s.id} value={s.id} className={chip}>
                {s.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Один раз</legend>
          <ToggleGroup
            type="multiple"
            value={value.once}
            onValueChange={(once) => onChange({ ...value, once })}
            className="flex w-full flex-wrap"
            spacing={2}
          >
            {ONCE.map((s) => (
              <ToggleGroupItem key={s.id} value={s.id} className={chip}>
                {s.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </fieldset>

        {hasAds && (
          <div>
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <label htmlFor="budget" className="text-sm font-semibold">
                Рекламный бюджет в месяц
              </label>
              <NumberFlow
                value={value.budget}
                format={eur}
                locales="ru-RU"
                className="text-base font-semibold tabular-nums"
              />
            </div>
            <Slider
              id="budget"
              aria-label="Рекламный бюджет в месяц"
              min={500}
              max={5000}
              step={100}
              value={[value.budget]}
              onValueChange={([budget]) => onChange({ ...value, budget })}
            />
            <p className="mt-2 text-[13px] text-muted-foreground">
              Его вы платите напрямую Google или Meta, не мне.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-6 border-t border-foreground/25 pt-5">
        <div>
          <p className="text-[13px] text-muted-foreground">Работа в месяц, от</p>
          <NumberFlow
            value={monthly}
            format={eur}
            locales="ru-RU"
            className="text-[40px] leading-none font-extrabold tracking-tight text-primary tabular-nums sm:text-[56px]"
          />
        </div>
        <div>
          <p className="text-[13px] text-muted-foreground">Разово, от</p>
          <NumberFlow
            value={once}
            format={eur}
            locales="ru-RU"
            className="text-[40px] leading-none font-extrabold tracking-tight tabular-nums sm:text-[56px]"
          />
        </div>
      </div>

      <ul className="mt-3 space-y-1 text-[13px] leading-snug text-muted-foreground">
        {nothing && <li>Выберите хотя бы одну услугу.</li>}
        {hasSocial && (
          <li>Meta, TikTok и Telegram: цену назову после мини-чека, в сумму не входит.</li>
        )}
        {value.once.includes("audit") && base > 0 && (
          <li>490 € за аудит засчитываются в первый месяц ведения.</li>
        )}
        {value.once.includes("tracking") && (
          <li>Трекинг: 390–790 €, зависит от числа событий и систем.</li>
        )}
      </ul>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          size="lg"
          className="h-12 px-5 text-base font-semibold"
          onClick={onSubmit}
        >
          Получить мини-чек за 0 €
        </Button>
        <Toggle
          pressed={value.pilot}
          onPressedChange={(pilot) => onChange({ ...value, pilot })}
          className={chip + " h-12 justify-start whitespace-normal text-left text-[13px] leading-tight"}
        >
          Пилот: −⅓ на 3 месяца
        </Toggle>
      </div>
      {value.pilot && (
        <p className="mt-2 text-[13px] text-muted-foreground">
          Для первых трёх клиентов в Германии — в обмен на письменный отзыв и право показать кейс.
        </p>
      )}
    </div>
  )
}
