import { useState } from "react"
import { MenuIcon } from "lucide-react"
import { toast } from "sonner"

import { BeforeAfter } from "@/components/BeforeAfter"
import { Configurator, type Selection } from "@/components/Configurator"
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

const NAV = [
  { href: "#results", label: "Результаты" },
  { href: "#services", label: "Услуги" },
  { href: "#prices", label: "Цены" },
  { href: "#steps", label: "Как работаем" },
  { href: "#faq", label: "Вопросы" },
]

const RESULTS = [
  {
    figure: "×13,16",
    metric: "вернула каждая гривна в рекламе",
    who: "Интернет-магазин, Украина · Google Ads",
    text: "Расход 275 696 ₴, ценность конверсий 3 628 284 ₴. ROAS 1316 %.",
  },
  {
    figure: "12 600",
    metric: "конверсий в среднем по 21,57 zł",
    who: "Многопрофильная клиника, Польша · Google Ads",
    text: "Медицина — тематика с самыми жёсткими правилами Google: половина работы здесь — пройти модерацию и не потерять аккаунт. Название клиента закрыто NDA.",
  },
  {
    figure: "+69 %",
    metric: "кликов из поиска год к году",
    who: "technomodule.zp.ua · SEO",
    text: "Средняя позиция с 17,5 до 7,0, клики на карточки товаров +99 %. Сравниваю июль–август 2026 и 2025, потому что ниша сезонная.",
  },
  {
    figure: "25 / 26",
    metric: "покупки в Google Ads и покупатели в GA4",
    who: "Онлайн-сервис документов, Польша · трекинг",
    text: "Октябрь 2026. После настройки трекинга реклама и аналитика расходятся на одну покупку, и ставки учатся на настоящих продажах.",
  },
]

const SERVICES = [
  {
    id: "google",
    name: "Google Ads",
    price: "от 590 € в месяц",
    lead: "Поиск, Performance Max, Shopping и ремаркетинг в вашем аккаунте.",
    points: [
      "Структура аккаунта, минус-слова, защита от скликивания",
      "Тематики с ограничениями: медицина, юристы, документы",
      "Отчёт в деньгах: расход, заявки, цена заявки",
    ],
  },
  {
    id: "seo",
    name: "SEO и GEO",
    price: "от 600 € в месяц",
    lead: "Семантика, структура, мета-теги, технический аудит и контент. Проектом или помесячно.",
    points: [
      "Многоязычные сайты с hreflang",
      "GEO: чтобы вас называли ChatGPT, Gemini и AI-обзоры Google",
      "Цена зависит от размера сайта, числа языков и конкуренции",
    ],
  },
  {
    id: "tracking",
    name: "Аналитика и трекинг",
    price: "390–790 € разово",
    lead: "GA4, Tag Manager, конверсии и связка GA4 с Google Ads.",
    points: [
      "Реклама считает настоящие покупки, а не просмотры страницы «спасибо»",
      "Проверка, что цифры в Ads и GA4 сходятся",
    ],
  },
  {
    id: "social",
    name: "Реклама в соцсетях",
    price: "цена после мини-чека",
    lead: "Платная реклама там, где ваша аудитория листает ленту.",
    points: [
      "Meta Ads: Facebook и Instagram",
      "TikTok Ads: короткие видео под заявки",
      "Telegram Ads: русскоязычная аудитория в Германии",
    ],
  },
  {
    id: "audit",
    name: "Аудит аккаунта и трекинга",
    price: "490 €",
    lead: "Полный разбор: куда уходит бюджет, что считается неверно и что исправить первым.",
    points: ["Сумма засчитывается в первый месяц ведения"],
  },
  {
    id: "gstart",
    name: "Google-Старт",
    price: "290 €",
    lead: "Профиль компании в Google и на Картах под ключ.",
    points: ["Создать, подтвердить, заполнить", "Короткий созвон в конце"],
  },
]

const STEPS = [
  {
    title: "Мини-чек, 0 €",
    text: "Вы присылаете сайт. Я смотрю рекламу или выдачу и возвращаю одну страницу с находками. Дальше решаете сами.",
  },
  {
    title: "Аудит, 490 €",
    text: "Полный разбор аккаунта и трекинга с планом по приоритетам.",
  },
  {
    title: "Запуск",
    text: "Настраиваю кампании и измерение в ваших аккаунтах.",
  },
  {
    title: "Ведение",
    text: "Каждый месяц отчёт: расход, заявки, цена заявки.",
  },
]

const FAQ = [
  {
    q: "Чьи будут рекламные аккаунты?",
    a: "Ваши. Я работаю через доступ, который вы можете отозвать в любой момент. Кампании, данные и история остаются у вас.",
  },
  {
    q: "На каком языке общаемся?",
    a: "Созвоны на русском или украинском.",
  },
  {
    q: "Какой нужен рекламный бюджет?",
    a: "От 500 € в месяц на сам рекламный кабинет. При меньшем бюджете данных не хватает, чтобы делать выводы.",
  },
  {
    q: "Вы гарантируете результат?",
    a: "Нет, и не верьте тем, кто гарантирует: аукцион и выдачу не контролирует никто. Я гарантирую понятный отчёт и то, что вы видите каждое изменение в аккаунте.",
  },
  {
    q: "Что, если мини-чек ничего не найдёт?",
    a: "Так и напишу. Тогда вам не нужен ни аудит, ни я.",
  },
]

const TOPICS = ["Google Ads", "SEO", "Meta Ads", "TikTok Ads", "Telegram Ads"]

const h2 =
  "text-[clamp(34px,4.6vw,68px)] leading-[1.02] font-extrabold tracking-[-0.03em]"
const wrap = "mx-auto w-full max-w-[1240px] px-4 sm:px-8"

const topicChip =
  "h-10 rounded-sm border border-foreground/30 px-3.5 text-[15px] font-medium text-foreground hover:bg-foreground/5 hover:text-foreground aria-pressed:bg-primary data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground"

const field =
  "h-12 rounded-sm border-input bg-transparent px-3.5 text-base md:text-base"

export function Landing({ children }: { children?: React.ReactNode }) {
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
    toast.info("Это черновик: форма пока не отправляет", {
      description: "Отправка заработает, когда подключим почту на хостинге.",
    })
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
      >
        К содержанию
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className={`${wrap} flex h-14 items-center justify-between gap-6`}>
          <a
            href="#top"
            className="text-xl font-extrabold tracking-tight"
          >
            VVdigital
          </a>
          <nav aria-label="Основная" className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[15px] font-medium underline-offset-4 hover:underline"
              >
                {item.label}
              </a>
            ))}
            <Button asChild className="h-9 px-4 text-[15px] font-semibold">
              <a href="#contact">Написать</a>
            </Button>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                className="border-input bg-transparent md:hidden"
                aria-label="Меню"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[82%] border-foreground/25 bg-background">
              <SheetHeader>
                <SheetTitle className="text-2xl font-extrabold">
                  Меню
                </SheetTitle>
                <SheetDescription className="sr-only">Разделы страницы</SheetDescription>
              </SheetHeader>
              <nav aria-label="Мобильная" className="flex flex-col px-4">
                {[...NAV, { href: "#contact", label: "Написать" }].map((item) => (
                  <SheetClose asChild key={item.href}>
                    <a
                      href={item.href}
                      className="border-b border-border py-4 text-lg font-medium"
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main id="main">
        {children}

        <section id="results" className={`${wrap} py-16 lg:py-28`}>
          <h2 className={h2}>
            Цифры из кабинетов,
            <br />
            не из презентаций
          </h2>
          <div className="mt-10 border-b border-foreground/25 lg:mt-14">
            {RESULTS.map((r) => (
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
          <p className="mt-5 max-w-[70ch] text-[15px] text-muted-foreground">
            GEO: клиника из второго кейса уже появляется в ответах ChatGPT и в
            AI-обзорах Google. Скриншоты с датами покажу на созвоне.
          </p>
        </section>

        <section id="before-after" className={`${wrap} pb-16 lg:pb-28`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14">
            <div>
              <h2 className={h2}>До и после</h2>
              <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-muted-foreground">
                Интернет-магазин technomodule.zp.ua, SEO. Ниша сезонная, поэтому
                сравниваю одно и то же лето: до начала работ и через год.
              </p>
              <dl className="mt-8 border-t border-foreground/25">
                <div className="flex items-baseline justify-between gap-6 border-b border-border py-4">
                  <dt>Средняя позиция</dt>
                  <dd className="text-2xl font-extrabold tracking-tight whitespace-nowrap">17,5 → 7,0</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-b border-border py-4">
                  <dt>Клики из поиска</dt>
                  <dd className="text-2xl font-extrabold tracking-tight whitespace-nowrap text-primary">+69 %</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-b border-border py-4">
                  <dt>Клики на карточки товаров</dt>
                  <dd className="text-2xl font-extrabold tracking-tight whitespace-nowrap">+99 %</dd>
                </div>
              </dl>
            </div>
            <BeforeAfter />
          </div>
        </section>

        <section id="services" className="bg-card">
          <div className={`${wrap} py-16 lg:py-28`}>
            <h2 className={h2}>Что я делаю</h2>
            <Tabs
              defaultValue="google"
              orientation="vertical"
              className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14"
            >
              <TabsList
                aria-label="Услуги"
                className="-mx-4 gap-6 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
              >
                {SERVICES.map((s) => (
                  <TabsTrigger
                    key={s.id}
                    value={s.id}
                    className="border-b-2 border-transparent py-2 text-lg font-semibold data-[state=active]:border-primary lg:border-b lg:border-border lg:py-4 lg:text-xl lg:data-[state=active]:border-border"
                  >
                    {s.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {SERVICES.map((s) => (
                <TabsContent key={s.id} value={s.id} className="lg:min-h-[420px]">
                  <h3 className="text-[clamp(32px,4vw,54px)] leading-[1.02] font-extrabold tracking-[-0.03em]">
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

        <section id="prices" className={`${wrap} py-16 lg:py-28`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <div>
              <h2 className={h2}>Сколько это стоит</h2>
              <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-muted-foreground">
                Цена зависит от размера сайта, числа языков и конкуренции, а не
                от названия ниши. Соберите задачу и увидите, от какой суммы
                считать.
              </p>
            </div>
            <Configurator value={selection} onChange={setSelection} onSubmit={goToForm} />
          </div>
        </section>

        <section id="steps" className={`${wrap} py-16 lg:py-28`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <h2 className={h2}>Как начинаем</h2>
            <ol>
              {STEPS.map((step, i) => (
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

        <section id="faq" className="bg-card">
          <div
            className={`${wrap} grid gap-12 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:py-28`}
          >
            <div>
              <h2 className={h2}>Кто за этим стоит</h2>
              <div className="mt-7 max-w-[46ch] space-y-4 text-lg leading-relaxed">
                <p>
                  Меня зовут Владислав. Начинал с арбитража трафика в Facebook и
                  Google Ads, где за каждую неточную ставку платишь своими
                  деньгами.
                </p>
                <p>
                  Потом были TikTok, SEO и клиентские проекты в Украине и
                  Польше. С 2023 года живу в Германии, работаю как
                  Selbstständig и выставляю Rechnung. Работаю удалённо по всей
                  стране.
                </p>
              </div>
            </div>
            <div>
              <h2 className="sr-only">Частые вопросы</h2>
              <Accordion type="single" collapsible className="border-t border-foreground/25">
                {FAQ.map((item) => (
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

        <section id="contact" className="bg-card">
          <div
            className={`${wrap} grid gap-10 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:py-28`}
          >
            <div>
              <h2 className={h2}>
                Пришлите сайт —<br />
                верну страницу
                <br />с находками
              </h2>
              <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-muted-foreground">
                Бесплатно и без обязательств. Доступы к аккаунтам на этом шаге
                не нужны.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
              <div className="space-y-2">
                <Label htmlFor="f-site" className="text-[15px]">
                  Сайт
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
                <legend className="mb-2 text-[15px] font-medium">Что проверить</legend>
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
                  Куда ответить
                </Label>
                <Input
                  id="f-contact"
                  name="contact"
                  required
                  placeholder="E-mail или Telegram"
                  className={field}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-note" className="text-[15px]">
                  Комментарий, если хотите
                </Label>
                <Textarea id="f-note" name="note" rows={3} className={`${field} h-auto py-3`} />
              </div>
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="f-company">Company</label>
                <input id="f-company" name="company" tabIndex={-1} autoComplete="off" />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-13 w-full px-6 text-base font-semibold sm:w-auto"
              >
                Получить мини-чек за 0 €
              </Button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card text-muted-foreground">
        <div className={`${wrap} flex flex-col gap-2 py-6 text-sm sm:flex-row sm:justify-between`}>
          <p>VVdigital, Германия</p>
          <p>Impressum и Datenschutz добавим перед запуском</p>
        </div>
      </footer>

      <Toaster position="bottom-center" />
    </>
  )
}
