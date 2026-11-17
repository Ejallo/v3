import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { CasesCards } from "@/components/CasesCards"
import { PriceBuilder } from "@/components/PriceBuilder"
import { ScrollRibbon } from "@/components/ScrollRibbon"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DICT, SiteFooter, SiteHeader, wrap, type Lang } from "@/components/SiteChrome"
import { FORM_ENDPOINT } from "@/config"

export type { Lang }

const TOPICS = ["Google Ads", "SEO", "Meta Ads", "TikTok Ads", "Telegram Ads"]
// A free review covers one channel at a time.
const REVIEW_TOPICS = ["Google Ads", "SEO", "Meta Ads"]

type FormMode = "order" | "free"
type ReplyType = "email" | "telegram" | "whatsapp"

const REPLY_TYPES: ReplyType[] = ["email", "telegram", "whatsapp"]

// Same rules as in worker/src/index.js. The HTML pattern is anchored by the browser.
const REPLY_FIELD: Record<ReplyType, { type: string; inputMode: "email" | "text" | "tel"; pattern?: string }> = {
  email: { type: "email", inputMode: "email" },
  telegram: { type: "text", inputMode: "text", pattern: "@?[A-Za-z0-9_]{5,32}|(https?://)?(www\\.)?t\\.me/\\S+" },
  whatsapp: { type: "tel", inputMode: "tel", pattern: "\\+?[0-9 \\-]{7,20}" },
}

const h2 =
  "max-w-[20ch] text-[clamp(32px,4.4vw,64px)] leading-[1.04] font-extrabold tracking-[-0.03em]"

const topicChip =
  "h-10 rounded-sm border border-foreground/30 px-3.5 text-[15px] font-medium text-foreground hover:bg-foreground/5 hover:text-foreground aria-pressed:bg-primary data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground"

const field =
  "h-12 rounded-sm border-input bg-transparent px-3.5 text-base md:text-base"

export function Landing({
  lang = "ru",
  children,
}: {
  lang?: Lang
  children?: React.ReactNode
}) {
  const t = DICT[lang]
  const [topics, setTopics] = useState<string[]>(["Google Ads"])
  const [mode, setMode] = useState<FormMode>("order")
  const [reviewTopic, setReviewTopic] = useState("Google Ads")
  const [replyType, setReplyType] = useState<ReplyType>("email")
  const [sending, setSending] = useState(false)
  const form = t.contact[mode]
  const orderTopics = [...TOPICS, t.contact.audit]

  // Any link with data-form="order" | "free" (hero, header, case, configurator)
  // opens the matching tab of the contact form before the browser jumps to #contact.
  useEffect(() => {
    // Links from other pages (the cases page) pick the tab with ?form=order|free.
    const fromUrl = new URLSearchParams(window.location.search).get("form")
    if (fromUrl === "order" || fromUrl === "free") setMode(fromUrl)

    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest<HTMLElement>("[data-form]")
      const next = link?.dataset.form
      if (next === "order" || next === "free") setMode(next)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  function goToForm(ids: string[]) {
    const next: string[] = []
    if (ids.includes("google")) next.push("Google Ads")
    if (ids.includes("seo")) next.push("SEO")
    if (ids.includes("social")) next.push("Meta Ads")
    if (ids.includes("audit") && !ids.includes("google")) next.push(t.contact.audit)
    if (next.length) setTopics(next)
    setMode("order")
    document.getElementById("contact")?.scrollIntoView()
    document.getElementById("f-site")?.focus({ preventScroll: true })
  }

  // After a no-JS form post the Worker sends the visitor back with ?sent=1 or ?sent=0.
  useEffect(() => {
    const sent = new URLSearchParams(window.location.search).get("sent")
    if (sent === "1") toast.success(t.contact.sentTitle, { description: t.contact.sentText })
    if (sent === "0") toast.error(t.contact.errorTitle, { description: t.contact.errorText })
    if (sent) {
      const url = new URL(window.location.href)
      url.searchParams.delete("sent")
      history.replaceState(null, "", url)
    }
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    const formEl = event.currentTarget
    if (!FORM_ENDPOINT) {
      toast.info(t.contact.draftTitle, { description: t.contact.draftText })
      return
    }
    setSending(true)
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(formEl))),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok || !body?.ok) throw new Error(body?.error ?? String(res.status))
      formEl.reset()
      toast.success(t.contact.sentTitle, { description: t.contact.sentText })
    } catch {
      toast.error(t.contact.errorTitle, { description: t.contact.errorText })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <SiteHeader lang={lang} />

      <main id="main" className="relative">
        {children}

        <section id="services" className="relative z-1">
          <div className={`${wrap} py-16 lg:py-28`}>
            <h2 className={h2}>{t.services.h2}</h2>
            <p className="mt-5 max-w-[56ch] text-xl leading-snug text-muted-foreground">{t.services.lead}</p>
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
                  {s.lead && <p className="mt-5 max-w-[48ch] text-xl leading-snug">{s.lead}</p>}
                  <ul className="mt-6 max-w-[60ch] border-t border-foreground/25">
                    {s.points.map((point) => (
                      <li key={point.d} className="border-b border-border py-3 leading-relaxed">
                        {point.t && <strong className="font-semibold">{point.t}</strong>} {point.d}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        <section id="results" className={`${wrap} relative z-1 py-16 lg:py-28`}>
          <CasesCards lang={lang} title={t.results.h2} titleClass={h2} />
        </section>

        <section id="prices" className="relative z-1">
          <div className={`${wrap} py-16 lg:py-28`}>
            <h2 className={h2}>{t.prices.h2}</h2>
            <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
              {t.prices.lead}
            </p>
            <div className="mt-10 lg:mt-14">
              <PriceBuilder t={t.priceBuilder} locale={t.locale} onSubmit={goToForm} />
            </div>
          </div>
        </section>

        <section id="steps" className={`${wrap} relative z-1 py-16 lg:py-28`}>
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

        <section id="contact" className="relative z-1">
          <div
            className={`${wrap} grid gap-10 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:py-28`}
          >
            <div>
              <h2 className={h2}>{form.h2}</h2>
              <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-muted-foreground">
                {form.lead}
              </p>
            </div>
            {/* method/action make the form work as a plain POST before React loads, so data never lands in the URL */}
            <form
              method="post"
              action={FORM_ENDPOINT || undefined}
              onSubmit={handleSubmit}
              className="ribbon-target space-y-6 rounded-lg border border-border bg-panel p-5 sm:p-8"
            >
              <div
                role="group"
                aria-label={t.contact.tabsLabel}
                className="grid grid-cols-2 gap-1 rounded-md border border-border bg-background p-1"
              >
                {(["order", "free"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={mode === m}
                    onClick={() => setMode(m)}
                    className="min-h-11 rounded-sm px-1 py-2 text-[13px] leading-tight font-semibold whitespace-nowrap min-[400px]:text-[15px] text-foreground transition-colors hover:bg-foreground/5 aria-pressed:bg-primary aria-pressed:text-primary-foreground sm:text-base"
                  >
                    {t.contact[m].tab}
                  </button>
                ))}
              </div>
              <input type="hidden" name="type" value={mode} />
              <input type="hidden" name="lang" value={lang} />
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
              {mode === "order" ? (
                <fieldset>
                  <legend className="mb-2 text-[15px] font-medium">{form.topics}</legend>
                  <ToggleGroup
                    type="multiple"
                    value={topics}
                    onValueChange={setTopics}
                    className="flex w-full flex-wrap"
                    spacing={2}
                  >
                    {orderTopics.map((topic) => (
                      <ToggleGroupItem key={topic} value={topic} className={topicChip}>
                        {topic}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <input type="hidden" name="topics" value={topics.join(", ")} />
                </fieldset>
              ) : (
                <fieldset>
                  <legend className="mb-2 text-[15px] font-medium">{form.topics}</legend>
                  <ToggleGroup
                    type="single"
                    value={reviewTopic}
                    onValueChange={(v) => v && setReviewTopic(v)}
                    className="flex w-full flex-wrap"
                    spacing={2}
                  >
                    {REVIEW_TOPICS.map((topic) => (
                      <ToggleGroupItem key={topic} value={topic} className={topicChip}>
                        {topic}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <input type="hidden" name="topics" value={reviewTopic} />
                </fieldset>
              )}
              <div className="space-y-2">
                <Label htmlFor="f-contact" className="text-[15px]">
                  {t.contact.reply}
                </Label>
                <ToggleGroup
                  type="single"
                  value={replyType}
                  onValueChange={(v) => v && setReplyType(v as ReplyType)}
                  className="flex w-full flex-wrap"
                  spacing={2}
                  aria-label={t.contact.reply}
                >
                  {REPLY_TYPES.map((r) => (
                    <ToggleGroupItem key={r} value={r} className={topicChip}>
                      {t.contact.replyTypes[r].label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <input type="hidden" name="contact_type" value={replyType} />
                <Input
                  key={replyType}
                  id="f-contact"
                  name="contact"
                  required
                  type={REPLY_FIELD[replyType].type}
                  inputMode={REPLY_FIELD[replyType].inputMode}
                  pattern={REPLY_FIELD[replyType].pattern}
                  title={t.contact.replyTypes[replyType].hint}
                  placeholder={t.contact.replyTypes[replyType].placeholder}
                  className={field}
                />
              </div>
              {mode === "order" && (
                <div className="space-y-2">
                  <Label htmlFor="f-note" className="text-[15px]">
                    {t.contact.note}{" "}
                    <span className="font-normal text-muted-foreground">{t.contact.noteHint}</span>
                  </Label>
                  <Textarea id="f-note" name="note" rows={3} className={`${field} h-auto py-3`} />
                </div>
              )}
              {/* Honeypot with a name no browser autofill knows, so real visitors never fill it */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="f-hp">Leave empty</label>
                <input id="f-hp" name="hp_zx" tabIndex={-1} autoComplete="off" />
              </div>
              {mode === "free" && (
                <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-snug">
                  <input type="checkbox" name="ack" required className="mt-0.5 size-5 shrink-0 accent-primary" />
                  <span>{t.contact.free.ack}</span>
                </label>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="h-13 w-full px-6 text-base font-semibold sm:w-auto"
              >
                {sending ? t.contact.sending : form.submit}
              </Button>
            </form>
          </div>
        </section>

        <section id="about" className="relative z-1">
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
              <Accordion
                type="single"
                collapsible
                defaultValue={t.faq.items[0]?.q}
                className="mt-5 gap-2"
              >
                {t.faq.items.map((item) => (
                  <AccordionItem
                    key={item.q}
                    value={item.q}
                    className="rounded-lg border border-foreground/15 transition-colors not-last:border-b data-[state=open]:border-primary"
                  >
                    <AccordionTrigger className="m-1 items-center gap-4 rounded-sm bg-panel px-4 py-3.5 text-lg leading-tight font-semibold transition-colors hover:bg-primary/8 hover:no-underline data-[state=open]:rounded-b-none data-[state=open]:bg-primary data-[state=open]:text-primary-foreground sm:px-6 sm:py-4 sm:text-[22px] [&>[data-slot=accordion-trigger-icon]]:hidden">
                      <span>{item.q}</span>
                      <Plus
                        aria-hidden
                        strokeWidth={2}
                        className="ml-auto size-6 shrink-0 text-primary transition-transform duration-500 group-aria-expanded/accordion-trigger:rotate-225 group-aria-expanded/accordion-trigger:text-primary-foreground"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="max-w-[60ch] p-4 text-base leading-relaxed sm:px-6 sm:pt-5 sm:pb-6 sm:text-[17px]">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <ScrollRibbon />
      </main>

      <SiteFooter lang={lang} />

      <Toaster position="bottom-center" />
    </>
  )
}
