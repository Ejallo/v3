# vvdigital-form

Cloudflare Worker that takes the landing's contact form and forwards it to Telegram. Nothing is stored.

## Setup (once)

1. Telegram: create a bot with @BotFather, copy the token. Send the bot any message, then open
   `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `message.chat.id`.
2. Cloudflare: create a free account.
3. In this folder:

   ```
   npx wrangler login
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler secret put TELEGRAM_CHAT_ID
   npx wrangler deploy
   ```

4. The Worker is served on `https://form.vvdigital.de` (custom domain in `wrangler.toml`; `workers.dev` is off).
   `src/config.ts` → `FORM_ENDPOINT` points there.

## Spam protection (Cloudflare Turnstile)

1. Cloudflare dashboard → Turnstile → Add widget: hostname `vvdigital.de`, mode **Invisible** (or Managed).
2. `npx wrangler secret put TURNSTILE_SECRET` (the widget's secret key), then `npx wrangler deploy`.
3. Put the site key into `src/config.ts` → `TURNSTILE_SITE_KEY`, build and deploy the site.

Order matters: once `TURNSTILE_SECRET` is set, submissions without a token are rejected, so deploy the site
with the site key right after. Without the secret the Worker skips the check.

## Local test

`npx wrangler dev --env dev` with a `.dev.vars` file (not committed). Cloudflare's test keys:
secret `1x0000000000000000000000000000000AA` always passes, `2x0000000000000000000000000000000AA` always fails;
site key `1x00000000000000000000BB` (invisible, passes) via `PUBLIC_TURNSTILE_SITE_KEY` when building the site.

## Before launch on the final domain

`ALLOWED_ORIGINS` in `wrangler.toml` lists production origins only; localhost lives in `[env.dev]`.
