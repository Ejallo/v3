import { useState } from "react"
import { MenuIcon } from "lucide-react"
import { toast } from "sonner"

import { Configurator, type Selection } from "@/components/Configurator"
import { MoneyPath } from "@/components/MoneyPath"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { de } from "@/i18n/de"
import { ru, type Dict } from "@/i18n/ru"

export type Lang = "ru" | "de"

const DICT: Record<Lang, Dict> = { ru, de }

const base = import.meta.env.BASE_URL.replace(/\/$/, "")
const LANGS: { lang: Lang; label: string; href: string }[] = [
  { lang: "ru", label: "RU", href: `${base}/` },
  { lang: "de", label: "DE", href: `${base}/de/` },
]

const TOPICS = ["Google Ads", "SEO", "Meta Ads", "TikTok Ads", "Telegram Ads"]

const h2 =
  "max-w-[20ch] text-[clamp(32px,4.4vw,64px)] leading-[1.04] font-extrabold tracking-[-0.03em]"
const wrap = "mx-auto w-full max-w-[1240px] px-4 sm:px-8"

const topicChip =
  "h-10 rounded-sm border border-foreground/30 px-3.5 text-[15px] font-medium text-foreground hover:bg-foreground/5 hover:text-foreground aria-pressed:bg-primary data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground"

const field =
  "h-12 rounded-sm border-input bg-transparent px-3.5 text-base md:text-base"

function LangSwitch({ current }: { current: Lang }) {
  return (
    <div className="flex items-center gap-1 text-[13px] font-semibold">
      {LANGS.map((item) => (
        <a
          key={item.lang}
          href={item.href}
          hrefLang={item.lang}
          aria-current={item.lang === current ? "page" : undefined}
          className="rounded-sm px-2 py-1.5 text-muted-foreground hover:text-foreground aria-[current=page]:bg-secondary aria-[current=page]:text-foreground"
        >
          {item.label}
        </a>
      ))}
    </div>
  )
}

export function Landing({
  lang = "ru",
  children,
}: {
  lang?: Lang
  children?: React.ReactNode
}) {
  const t = DICT[lang]
  const [selection, setSelection] = useState<Selection>({
    monthly: ["google"],
    once: ["audit"],
    pilot: false,
    budget: 1500,
  })
  const [topics, setTopics] = useState<string[]>(["Google Ads"])

  function goToForm() {
    const next: string[] = []
    if (selection.monthly.includes("google")) next.push("Google Ads")
    if (selection.monthly.includes("seo")) next.push("SEO")
    if (selection.monthly.includes("social")) next.push("Meta Ads")
    if (next.length) setTopics(next)
    document.getElementById("contact")?.scrollIntoView()
    document.getElementById("f-site")?.focus({ preventScroll: true })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    // Honeypot: real visitors never fill this field.
    if (data.get("company")) return
    // TODO: POST to /send.php once the hosting and mailbox exist.
    toast.info(t.contact.toastTitle, { description: t.contact.toastText })
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
      >
        {t.skip}
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className={`${wrap} flex h-14 items-center justify-between gap-4`}>
          <a href="#top" className="text-xl font-extrabold tracking-tight">
            VVdigital
          </a>
          <nav aria-label={t.navLabel} className="hidden items-center gap-6 lg:flex">
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[15px] font-medium underline-offset-4 hover:underline"
              >
                {item.label}
              </a>
            ))}
            <LangSwitch current={lang} />
            <Button asChild className="h-9 px-4 text-[15px] font-semibold">
              <a href="#contact">{t.write}</a>
            </Button>
          </nav>
          <div className="flex items-center gap-2 lg:hidden">
            <LangSwitch current={lang} />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="border-input bg-transparent"
                  aria-label={t.menu}
                >
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[82%] border-foreground/25 bg-background">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-extrabold">{t.menu}</SheetTitle>
                  <SheetDescription className="sr-only">{t.menuDescription}</SheetDescription>
                </SheetHeader>
                <nav aria-label={t.navMobileLabel} className="flex flex-col px-4">
                  {[...t.nav, { href: "#contact", label: t.write }].map((item) => (
                    <SheetClose asChild key={item.href}>
                      <a href={item.href} className="border-b border-border py-4 text-lg font-medium">
                        {item.label}
                      </a>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main id="main">
        {children}

        <section id="services" className="bg-card">
          <div className={`${wrap} py-16 lg:py-28`}>
            <h2 className={h2}>{t.services.h2}</h2>
            <Tabs
              defaultValue="google"
              orientation="vertical"
              className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14"
            >
              <TabsList
                aria-label={t.services.tabsLabel}
                className="-mx-4 gap-6 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
              >
                {t.services.items.map((s) => (
                  <TabsTrigger
                    key={s.id}
                    value={s.id}
                    className="border-b-2 border-transparent py-2 text-lg font-semibold data-[state=active]:border-primary lg:border-b lg:border-border lg:py-4 lg:text-xl lg:data-[state=active]:border-border"
                  >
                    {s.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {t.services.items.map((s) => (
                <TabsContent key={s.id} value={s.id} className="lg:min-h-[420px]">
                  <h3 className="text-[clamp(30px,4vw,54px)] leading-[1.04] font-extrabold tracking-[-0.03em]">
                    {s.name}
                  </h3>
                  <p className="mt-5 max-w-[48ch] text-xl leading-snug">{s.lead}</p>
                  <ul className="mt-6 max-w-[60ch] border-t border-foreground/25">
                    {s.points.map((point) => (
                      <li key={point} className="border-b border-border py-3 leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-7 text-[30px] leading-none font-extrabold tracking-tight text-primary">
                    {s.price}
                  </p>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        <section id="results" className={`${wrap} py-16 lg:py-28`}>
          <h2 className={h2}>{t.results.h2}</h2>
          <div className="mt-10 border-b border-foreground/25 lg:mt-14">
            {t.results.rows.map((r) => (
              <article
                key={r.figure}
                className="grid gap-x-10 gap-y-3 border-t border-foreground/25 py-7 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center lg:py-9"
              >
                <p className="text-[clamp(52px,7.6vw,108px)] leading-[0.9] font-extrabold tracking-[-0.04em] whitespace-nowrap text-violet">
                  {r.figure}
                </p>
                <div>
                  <h3 className="text-xl leading-snug font-semibold lg:text-2xl">{r.metric}</h3>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{r.who}</p>
                  <p className="mt-3 max-w-[58ch] leading-relaxed">{r.text}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 max-w-[70ch] text-[15px] text-muted-foreground">{t.results.geo}</p>
        </section>

        <section id="money" className={`${wrap} pb-16 lg:pb-28`}>
          <h2 className={h2}>{t.money.h2}</h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
            {t.money.lead}
          </p>
          <div className="mt-10 lg:mt-14">
            <MoneyPath t={t.money} />
          </div>
        </section>

        <section id="prices" className="bg-card">
          <div
            className={`${wrap} grid gap-10 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:py-28`}
          >
            <div>
              <h2 className={h2}>{t.prices.h2}</h2>
              <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-muted-foreground">
                {t.prices.lead}
              </p>
            </div>
            <Configurator
              t={t.configurator}
              locale={t.locale}
              value={selection}
              onChange={setSelection}
              onSubmit={goToForm}
            />
          </div>
        </section>

        <section id="steps" className={`${wrap} py-16 lg:py-28`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <h2 className={h2}>{t.steps.h2}</h2>
            <ol>
              {t.steps.items.map((step, i) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 border-t border-foreground/25 py-6 sm:grid-cols-[96px_minmax(0,1fr)]"
                >
                  <span
                    aria-hidden="true"
                    className="text-[52px] leading-[0.85] font-extrabold tracking-tight text-violet sm:text-[72px]"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 max-w-[52ch] leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="about" className="bg-card">
          <div
            className={`${wrap} grid gap-12 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:py-28`}
          >
            <div>
              <h2 className={h2}>{t.about.h2}</h2>
              <div className="mt-7 max-w-[46ch] space-y-4 text-lg leading-relaxed">
                {t.about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div id="faq">
              <h2 className="text-2xl font-extrabold tracking-tight lg:text-3xl">{t.faq.h2}</h2>
              <Accordion type="single" collapsible className="mt-5 border-t border-foreground/25">
                {t.faq.items.map((item) => (
                  <AccordionItem key={item.q} value={item.q} className="border-border">
                    <AccordionTrigger className="rounded-sm py-5 text-lg font-semibold">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="max-w-[60ch] pb-5 text-base leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section id="contact">
          <div
            className={`${wrap} grid gap-10 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:py-28`}
          >
            <div>
              <h2 className={h2}>{t.contact.h2}</h2>
              <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-muted-foreground">
                {t.contact.lead}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="f-site" className="text-[15px]">
                  {t.contact.site}
                </Label>
                <Input
                  id="f-site"
                  name="site"
                  required
                  inputMode="url"
                  autoComplete="url"
                  placeholder="mein-betrieb.de"
                  className={field}
                />
              </div>
              <fieldset>
                <legend className="mb-2 text-[15px] font-medium">{t.contact.topics}</legend>
                <ToggleGroup
                  type="multiple"
                  value={topics}
                  onValueChange={setTopics}
                  className="flex w-full flex-wrap"
                  spacing={2}
                >
                  {TOPICS.map((topic) => (
                    <ToggleGroupItem key={topic} value={topic} className={topicChip}>
                      {topic}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <input type="hidden" name="topics" value={topics.join(", ")} />
              </fieldset>
              <div className="space-y-2">
                <Label htmlFor="f-contact" className="text-[15px]">
                  {t.contact.reply}
                </Label>
                <Input
                  id="f-contact"
                  name="contact"
                  required
                  placeholder={t.contact.replyPlaceholder}
                  className={field}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-note" className="text-[15px]">
                  {t.contact.note}
                </Label>
                <Textarea id="f-note" name="note" rows={3} className={`${field} h-auto py-3`} />
              </div>
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="f-company">Company</label>
                <input id="f-company" name="company" tabIndex={-1} autoComplete="off" />
              </div>
              <Button type="submit" size="lg" className="h-13 w-full px-6 text-base font-semibold sm:w-auto">
                {t.contact.submit}
              </Button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card text-muted-foreground">
        <div className={`${wrap} flex flex-col gap-2 py-6 text-sm sm:flex-row sm:justify-between`}>
          <p>{t.footer.left}</p>
          <p>{t.footer.right}</p>
        </div>
      </footer>

      <Toaster position="bottom-center" />
    </>
  )
}
