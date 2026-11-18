import { MailIcon, MenuIcon } from "lucide-react"

import { TelegramIcon, WhatsAppIcon } from "@/components/BrandIcons"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { de } from "@/i18n/de"
import { ru, type Dict } from "@/i18n/ru"
import { CONTACTS } from "@/config"

export type Lang = "ru" | "de"

export const DICT: Record<Lang, Dict> = { ru, de }

export const base = import.meta.env.BASE_URL.replace(/\/$/, "")
export const wrap = "mx-auto w-full max-w-[1240px] px-4 sm:px-8"

/** Home page of a language, e.g. "/" or "/de/" (with the base path, if any). */
export const homeOf = (lang: Lang) => `${base}${lang === "ru" ? "/" : "/de/"}`

const LANG_LABELS: Record<Lang, string> = { ru: "RU", de: "DE" }

function LangSwitch({ current, hrefs }: { current: Lang; hrefs: Record<Lang, string> }) {
  return (
    <div className="flex items-center gap-1 text-[13px] font-semibold">
      {(Object.keys(hrefs) as Lang[]).map((lang) => (
        <a
          key={lang}
          href={hrefs[lang]}
          hrefLang={lang}
          aria-current={lang === current ? "page" : undefined}
          className="rounded-sm px-2 py-1.5 text-muted-foreground hover:text-foreground aria-[current=page]:bg-secondary aria-[current=page]:text-foreground"
        >
          {LANG_LABELS[lang]}
        </a>
      ))}
    </div>
  )
}

/** The contacts block sits in the footer of every page, so that link stays on the current page. */
const navHref = (home: string, href: string) => (href === "#contacts" ? href : home + href)

/**
 * Site header. On the home page the section links are plain anchors ("#prices");
 * on other pages `home` is set so they lead back to the home page sections.
 */
export function SiteHeader({
  lang,
  home = "",
  langHrefs = { ru: homeOf("ru"), de: homeOf("de") },
}: {
  lang: Lang
  home?: string
  langHrefs?: Record<Lang, string>
}) {
  const t = DICT[lang]
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
          <a href={home ? home : "#top"} className="text-xl font-extrabold tracking-tight">
            VVdigital
          </a>
          <nav aria-label={t.navLabel} className="hidden items-center gap-6 lg:flex">
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={navHref(home, item.href)}
                className="text-[15px] font-medium underline-offset-4 hover:underline"
              >
                {item.label}
              </a>
            ))}
            <LangSwitch current={lang} hrefs={langHrefs} />
            <Button asChild className="h-9 px-4 text-[15px] font-semibold">
              <a href={`${home}#contact`} data-form="order">
                {t.write}
              </a>
            </Button>
          </nav>
          <div className="flex items-center gap-2 lg:hidden">
            <LangSwitch current={lang} hrefs={langHrefs} />
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
                      <a
                        href={navHref(home, item.href)}
                        data-form={item.href === "#contact" ? "order" : undefined}
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
        </div>
      </header>
    </>
  )
}

const contactBtn =
  "inline-flex h-13 items-center gap-2.5 rounded-xl px-[18px] text-base font-bold transition-opacity hover:opacity-90"

/** A contact button; without a target (contact not filled in yet) it renders as plain text. */
function ContactButton({ href, className, children }: { href?: string; className: string; children: React.ReactNode }) {
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${contactBtn} ${className}`}>
      {children}
    </a>
  ) : (
    <span className={`${contactBtn} ${className}`}>{children}</span>
  )
}

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = DICT[lang]
  const telegram = CONTACTS.telegram.replace(/^@/, "")
  const whatsapp = CONTACTS.whatsapp.replace(/\D/g, "")
  return (
    <footer className="border-t border-border bg-card text-muted-foreground">
      <div
        id="contacts"
        className={`${wrap} flex scroll-mt-16 flex-wrap items-center justify-between gap-6 border-b border-border py-9`}
      >
        <p className="text-[clamp(22px,2vw,30px)] font-extrabold tracking-[-0.02em] text-foreground">{t.footer.direct}</p>
        <div className="flex flex-wrap gap-3">
          <ContactButton href={telegram ? `https://t.me/${telegram}` : undefined} className="bg-[#229ED9] text-white">
            <TelegramIcon className="size-5.5" />
            Telegram
          </ContactButton>
          <ContactButton href={whatsapp ? `https://wa.me/${whatsapp}` : undefined} className="bg-[#25D366] text-white">
            <WhatsAppIcon className="size-5.5" />
            WhatsApp
          </ContactButton>
          <a href={`mailto:${CONTACTS.email}`} className={`${contactBtn} bg-primary text-primary-foreground`}>
            <MailIcon aria-hidden="true" className="size-5.5" />
            {CONTACTS.email}
          </a>
        </div>
      </div>
      <div className={`${wrap} flex flex-col gap-2 py-6 text-sm sm:flex-row sm:justify-between`}>
        <p>{t.footer.left}</p>
        <nav aria-label={t.footer.legalLabel} className="flex gap-5">
          <a href={`${homeOf(lang)}impressum/`} className="underline-offset-4 hover:text-foreground hover:underline">
            {t.footer.imprint}
          </a>
          <a href={`${homeOf(lang)}datenschutz/`} className="underline-offset-4 hover:text-foreground hover:underline">
            {t.footer.privacy}
          </a>
          {/* Opened by CookieConsent.astro via data-vv-consent-open: works on static pages without React */}
          <button
            type="button"
            data-vv-consent-open
            className="cursor-pointer underline-offset-4 hover:text-foreground hover:underline"
          >
            {t.footer.cookies}
          </button>
        </nav>
      </div>
    </footer>
  )
}
