// Site-wide switches. Change here, rebuild, push.

/** URL of the form Worker (worker/README.md). Empty: the form shows a "not connected yet" notice. */
export const FORM_ENDPOINT = "https://form.vvdigital.de"

/**
 * Cloudflare Turnstile site key (dashboard → Turnstile → the vvdigital.de widget). Empty: no spam check in the form.
 * Set it together with the Worker secret TURNSTILE_SECRET, otherwise the Worker rejects every submission.
 * PUBLIC_TURNSTILE_SITE_KEY overrides it for local tests with Cloudflare's test keys.
 */
export const TURNSTILE_SITE_KEY: string = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAGGs94q480FVDtTp"

/**
 * Show the cookie card to new visitors. Off while the site loads nothing that needs consent;
 * turn on in the same change that adds analytics or ad tags. The footer link opens the card either way.
 */
export const ASK_CONSENT = false

/**
 * Launch switch. false while the site is a draft:
 * every page gets noindex and robots.txt disallows everything.
 * true on the final domain: pages become indexable and robots.txt points to the sitemap.
 */
export const INDEXABLE = false

/** Pages listed in sitemap.xml, relative to the site root. */
export const PAGES = ["/", "/de/", "/cases/", "/de/cases/"]

/** The final domain, used for sitemap.xml and robots.txt once INDEXABLE is on. Fill in before launch. */
export const SITE_URL = "https://vvdigital.de"
