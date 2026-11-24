// Prefix a site path with the Astro base (/v3 while on GitHub Pages).
export function url(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = path.replace(/^\//, '');
  return `${base}/${p}`;
}

export function homeFor(lang: string) {
  return lang === 'ru' ? url('ru/') : url('');
}
