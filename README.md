# REMAUTO Detailing — website

Astro + React islands. Czech (`/`) and Russian (`/ru/`).

- `npm run dev` — local dev server
- `npm run build` — static build to `dist/`
- Push to `main` → GitHub Actions publishes to GitHub Pages (`ejallo.github.io/v3/`).

Where things live:

- `src/config.ts` — phone, address, hours, socials, form endpoint, `INDEXABLE` switch. Empty values show as yellow "doplnit / заполнить" marks on the page.
- `src/i18n/cs.ts`, `src/i18n/ru.ts` — all texts.
- `src/i18n/prices.ts` — price list, packages, body-type surcharges.
- `src/assets/photos/` — photos (downscaled to 2400 px; Astro makes AVIF/WebP sizes at build).
- `scripts/` — helper scripts (photo downscale, before/after alignment).

When the domain is bought: set `site` and remove `base` in `astro.config.mjs`, set `INDEXABLE = true`.
