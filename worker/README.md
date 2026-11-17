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

4. Put the printed `https://vvdigital-form.<account>.workers.dev` URL into `src/config.ts` (`FORM_ENDPOINT`).

## Before launch on the final domain

Add the domain to `ALLOWED_ORIGINS` in `wrangler.toml`, set `FALLBACK_PATH = "/"`, run `npx wrangler deploy`.
