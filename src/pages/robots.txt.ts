// robots.txt: blocks everything while the site is a draft, opens it and points to the sitemap at launch.
import type { APIRoute } from "astro"
import { INDEXABLE, SITE_URL } from "../config"

export const GET: APIRoute = () => {
  const body = INDEXABLE
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n"
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
