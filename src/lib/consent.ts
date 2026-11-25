// Cookie consent store (client side). One record in localStorage, re-asked after 12 months
// or when VERSION changes (bump it when a new category or tool is added).
// Other scripts listen to the `rm:consent` window event; `rm:consent-open` opens the settings dialog.

export type Category = 'media' | 'analytics' | 'marketing';
export type Choice = Record<Category, boolean>;
export interface Consent extends Choice {
  v: number;
  ts: number;
}

const KEY = 'rm-consent';
const VERSION = 1;
const MAX_AGE = 365 * 24 * 60 * 60 * 1000;
let memory: Consent | null = null; // fallback when storage is blocked

export function readConsent(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || 'null') as Consent | null;
    if (c && c.v === VERSION && Date.now() - c.ts < MAX_AGE) return c;
    return null;
  } catch {
    return memory;
  }
}

export function saveConsent(choice: Choice): Consent {
  const c: Consent = { v: VERSION, ts: Date.now(), ...choice };
  memory = c;
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* private mode: keep it for this page view only */
  }
  window.dispatchEvent(new CustomEvent<Consent>('rm:consent', { detail: c }));
  return c;
}

export function allowed(cat: Category): boolean {
  return !!readConsent()?.[cat];
}

/** Calls back now (if a choice exists) and on every later change. */
export function onConsent(cb: (c: Consent) => void) {
  const c = readConsent();
  if (c) cb(c);
  window.addEventListener('rm:consent', (e) => cb((e as CustomEvent<Consent>).detail));
}

export function openConsentSettings() {
  window.dispatchEvent(new Event('rm:consent-open'));
}
