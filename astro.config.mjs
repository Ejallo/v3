// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { INDEXABLE } from './src/config.ts';

// Temporary home: GitHub Pages under /v3/ until the Remauto domain is bought.
// When the domain is live: set `site` to it, drop `base`, and flip INDEXABLE in src/config.ts.
export default defineConfig({
  site: 'https://ejallo.github.io',
  base: '/v3',
  trailingSlash: 'always',
  // The sitemap is built only once the site is indexable (real domain). hreflang pairs live in each page's <head>.
  integrations: [react(), ...(INDEXABLE ? [sitemap({ filter: (page) => !page.includes('/404') })] : [])],
  build: { inlineStylesheets: 'always' },
  image: { responsiveStyles: false },
});
