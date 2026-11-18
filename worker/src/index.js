// Contact form backend for the VVdigital landing.
// Receives the form (JSON from fetch, or a plain HTML form post without JS),
// validates it and forwards it to a Telegram chat. Nothing is stored here.
//
// Secrets (wrangler secret put): TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID,
//   TURNSTILE_SECRET (optional: when set, every submission must carry a valid Cloudflare Turnstile token)
// Vars (wrangler.toml): ALLOWED_ORIGINS, FALLBACK_PATH
// Binding (wrangler.toml): RATE_LIMITER

const LIMITS = { site: 200, contact: 200, topics: 300, note: 2000 }
const TYPES = new Set(["order", "free"])
const LANGS = new Set(["ru", "de"])

// How to reply: format check per channel (same rules as the form) and the label shown in Telegram.
const CONTACT_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  telegram: /^(@?[A-Za-z0-9_]{5,32}|(https?:\/\/)?(www\.)?t\.me\/\S+)$/,
  whatsapp: /^\+?[0-9 -]{7,20}$/,
}
const CONTACT_LABELS = { email: "E-mail", telegram: "Telegram", whatsapp: "WhatsApp" }

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  }
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) },
  })
}

// Strips control characters (keeps line breaks) and trims.
function clean(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
}

async function readBody(request) {
  const type = request.headers.get("Content-Type") || ""
  if (type.includes("application/json")) return await request.json()
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    return Object.fromEntries(await request.formData())
  }
  throw new Error("unsupported content type")
}

function validate(raw) {
  const data = {
    type: clean(raw.type),
    lang: clean(raw.lang),
    site: clean(raw.site),
    contact: clean(raw.contact),
    contactType: clean(raw.contact_type),
    topics: clean(raw.topics),
    note: clean(raw.note),
  }
  if (!TYPES.has(data.type)) return { error: "type" }
  // The free review needs the terms checkbox; the browser's `required` alone is not a check.
  if (data.type === "free" && !clean(raw.ack)) return { error: "ack" }
  if (!LANGS.has(data.lang)) data.lang = "ru"
  if (!CONTACT_RULES[data.contactType]) data.contactType = "email"
  if (data.site.length < 3 || data.site.length > LIMITS.site) return { error: "site" }
  if (data.contact.length < 3 || data.contact.length > LIMITS.contact) return { error: "contact" }
  if (!CONTACT_RULES[data.contactType].test(data.contact)) return { error: "contact" }
  if (data.topics.length > LIMITS.topics) return { error: "topics" }
  if (data.note.length > LIMITS.note) return { error: "note" }
  return { data }
}

function message(d) {
  const kind = d.type === "order" ? "Заказ" : "Бесплатный разбор"
  const lines = [
    `Новая заявка: ${kind} (${d.lang.toUpperCase()})`,
    "",
    `Сайт: ${d.site}`,
    `Ответить (${CONTACT_LABELS[d.contactType]}): ${d.contact}`,
  ]
  if (d.topics) lines.push(`Темы: ${d.topics}`)
  if (d.note) lines.push("", `Комментарий: ${d.note}`)
  return lines.join("\n")
}

async function sendToTelegram(env, text) {
  // Plain text, no parse_mode: user input can't inject markup into the message.
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text,
      link_preview_options: { is_disabled: true },
    }),
  })
  if (!res.ok) throw new Error(`telegram ${res.status}`)
}

// Cloudflare Turnstile: the Origin header is trivial to fake outside a browser, the token is not.
// Skipped while TURNSTILE_SECRET is not set, so the Worker can be deployed before the widget exists.
async function passesTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true
  if (!token || token.length > 2048) return false
  const body = new FormData()
  body.append("secret", env.TURNSTILE_SECRET)
  body.append("response", token)
  if (ip) body.append("remoteip", ip)
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body })
    const out = await res.json()
    return out.success === true
  } catch (e) {
    console.error("turnstile", e)
    return false
  }
}

// Where a plain (no-JS) form post goes back to. Only ever the allowed origin,
// plus the path of the page the form was sent from, so it can't be an open redirect.
function backTo(request, origin, env, status) {
  let path = env.FALLBACK_PATH || "/"
  const referer = request.headers.get("Referer")
  if (referer) {
    try {
      const r = new URL(referer)
      if (r.origin === origin) path = r.pathname
    } catch {
      // keep the fallback path
    }
  }
  const url = new URL(path, origin)
  url.searchParams.set("sent", status)
  url.hash = "contact"
  return Response.redirect(url.toString(), 303)
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || ""
    const allowed = allowedOrigins(env).includes(origin)

    if (request.method === "OPTIONS") {
      return allowed ? new Response(null, { status: 204, headers: corsHeaders(origin) }) : new Response(null, { status: 403 })
    }
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 })
    // Browsers always send Origin on a cross-site POST; anything else is not our form.
    if (!allowed) return new Response("Forbidden", { status: 403 })

    const wantsJson = (request.headers.get("Accept") || "").includes("application/json")
    const reply = (ok, status, error) =>
      wantsJson ? json(ok ? { ok: true } : { ok: false, error }, status, origin) : backTo(request, origin, env, ok ? "1" : "0")

    const ip = request.headers.get("CF-Connecting-IP") || ""
    if (env.RATE_LIMITER) {
      const { success } = await env.RATE_LIMITER.limit({ key: ip || "unknown" })
      if (!success) return reply(false, 429, "rate")
    }

    let raw
    try {
      raw = await readBody(request)
    } catch {
      return reply(false, 400, "body")
    }
    // JSON may be null, a number or an array: only a plain object is a form.
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return reply(false, 400, "body")

    // Honeypot: a bot filled the hidden field. Answer "ok" so it doesn't retry.
    if (clean(raw.hp_zx)) return reply(true, 200)

    const { data, error } = validate(raw)
    if (error) return reply(false, 422, error)

    if (!(await passesTurnstile(env, clean(raw["cf-turnstile-response"]), ip))) return reply(false, 403, "captcha")

    try {
      await sendToTelegram(env, message(data))
    } catch (e) {
      console.error(e)
      return reply(false, 502, "send")
    }
    return reply(true, 200)
  },
}
