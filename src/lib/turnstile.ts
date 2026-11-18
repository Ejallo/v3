// Cloudflare Turnstile for the contact form. The script loads only when the visitor
// gets close to the form, so it costs nothing on the first screen.
// With appearance "interaction-only" the widget stays invisible unless Cloudflare
// really needs the visitor to click something.
import { useCallback, useEffect, useRef, type RefObject } from "react"

type Api = {
  render(el: HTMLElement, opts: Record<string, unknown>): string
  reset(id: string): void
  getResponse(id: string): string | undefined
  remove(id: string): void
}

declare global {
  interface Window {
    turnstile?: Api
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
let loading: Promise<Api> | null = null

function load(): Promise<Api> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  loading ??= new Promise<Api>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = SRC
    script.async = true
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile")))
    script.onerror = () => {
      loading = null
      script.remove()
      reject(new Error("turnstile"))
    }
    document.head.appendChild(script)
  })
  return loading
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Renders the widget into `box` once `near` (the form) is about to scroll into view or gets focus.
 * `token()` resolves to the current token (waits up to ~10 s for it), or "" if there is none.
 */
export function useTurnstile(
  siteKey: string,
  lang: string,
  box: RefObject<HTMLElement | null>,
  near: RefObject<HTMLElement | null>
) {
  const id = useRef<string | null>(null)
  const start = useRef<() => Promise<void>>(async () => {})

  useEffect(() => {
    if (!siteKey) return
    let cancelled = false
    let started = false
    let sizer: ResizeObserver | null = null
    start.current = async () => {
      if (started || !box.current) return
      started = true
      try {
        const api = await load()
        if (cancelled || !box.current) return
        id.current = api.render(box.current, {
          sitekey: siteKey,
          appearance: "interaction-only",
          theme: "dark",
          size: "flexible",
          language: lang,
          // Tokens live 5 minutes; get a fresh one silently instead of failing on submit.
          "refresh-expired": "auto",
          // Handled here instead of an uncaught TurnstileError; submit then reports the failure.
          "error-callback": () => true,
        })
        // The widget lives in a closed shadow root, so CSS can't see it. Mark the box while
        // the widget has a size (Cloudflare wants a click) so it gets its spacing only then.
        const el = box.current
        const inner = el.firstElementChild
        if (inner) {
          sizer = new ResizeObserver(() => {
            el.toggleAttribute("data-shown", inner.getBoundingClientRect().height > 0)
          })
          sizer.observe(inner)
        }
      } catch {
        started = false // blocked or offline: try again on the next focus or submit
      }
    }
    const target = near.current
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && start.current(),
      { rootMargin: "600px 0px" }
    )
    if (target) {
      io.observe(target)
      target.addEventListener("focusin", start.current)
    }
    return () => {
      cancelled = true
      io.disconnect()
      sizer?.disconnect()
      target?.removeEventListener("focusin", start.current)
      if (id.current && window.turnstile) window.turnstile.remove(id.current)
      id.current = null
    }
  }, [siteKey, lang, box, near])

  const token = useCallback(async () => {
    if (!siteKey) return ""
    await start.current()
    for (let i = 0; i < 40; i++) {
      const value = id.current && window.turnstile?.getResponse(id.current)
      if (value) return value
      await sleep(250)
    }
    return ""
  }, [siteKey])

  // A token is single-use: get a new one after every submission attempt.
  const reset = useCallback(() => {
    if (id.current && window.turnstile) window.turnstile.reset(id.current)
  }, [])

  return { token, reset }
}
