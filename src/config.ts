// Site-wide switches. Change here, rebuild, push.

/** URL of the form Worker (worker/README.md). Empty: the form shows a "not connected yet" notice. */
export const FORM_ENDPOINT = "https://vvdigital-form.vetervlad94.workers.dev"

/**
 * Launch switch. false while the site is a draft on ejallo.github.io/v3:
 * every page gets noindex and robots.txt disallows everything.
 * true on the final domain: pages become indexable and robots.txt points to the sitemap.
 */
export const INDEXABLE = false

/** Pages listed in sitemap.xml, relative to the site root. */
export const PAGES = ["/", "/de/", "/cases/", "/de/cases/"]

/** The final domain, used for sitemap.xml and robots.txt once INDEXABLE is on. Fill in before launch. */
export const SITE_URL = ""
