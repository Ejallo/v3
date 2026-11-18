# VVdigital landing (v3)

Draft landing page for VVdigital: Astro + React + Tailwind + shadcn/ui, with a three.js hero scene.

## Commands

| Command           | Action                                  |
| :---------------- | :-------------------------------------- |
| `npm install`     | Install dependencies                    |
| `npm run dev`     | Start the dev server at localhost:4321  |
| `npm run build`   | Build the static site into `dist/`      |
| `npm run preview` | Preview the build locally               |

## Status

Live on https://vvdigital.de (Cloudflare Pages), still `noindex` (`INDEXABLE` in `src/config.ts`).
Impressum and Datenschutz have placeholders to fill before launch.

## Deploy

Manual for now, from a folder outside the project (running wrangler inside it rewrites the config):

    node node_modules/astro/bin/astro.mjs build --outDir ../_build
    cd ../_build && npx wrangler pages deploy . --project-name=vvdigital --branch=main

Every push to `main` runs `.github/workflows/deploy.yml`: it turns the old GitHub Pages copy into a redirect to
vvdigital.de, and deploys to Cloudflare Pages once the repository secrets `CLOUDFLARE_API_TOKEN`
("Cloudflare Pages: Edit") and `CLOUDFLARE_ACCOUNT_ID` exist (until then that job skips).

The contact form backend is a separate Worker, see `worker/README.md`.
