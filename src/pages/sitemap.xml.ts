// sitemap.xml with the RU/DE pairs as hreflang alternates. Only meaningful once INDEXABLE and SITE_URL are set.
import type { APIRoute } from "astro"
import { PAGES, SITE_URL } from "../config"

const pair = (path: string) => (path.startsWith("/de/") ? path.slice(3) : `/de${path}`)

export const GET: APIRoute = () => {
  const urls = PAGES.map((path) => {
    const ru = path.startsWith("/de/") ? pair(path) : path
    const de = path.startsWith("/de/") ? path : pair(path)
    return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <xhtml:link rel="alternate" hreflang="ru" href="${SITE_URL}${ru}"/>
    <xhtml:link rel="alternate" hreflang="de" href="${SITE_URL}${de}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${de}"/>
  </url>`
  }).join("\n")
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } })
}
