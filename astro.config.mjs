// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Temporary home: GitHub Pages under /v3/ until the Remauto domain is bought.
// When the domain is live: set `site` to it, drop `base`, and flip INDEXABLE in src/config.ts.
export default defineConfig({
  site: 'https://ejallo.github.io',
  base: '/v3',
  trailingSlash: 'always',
  integrations: [react()],
  build: { inlineStylesheets: 'always' },
  image: { responsiveStyles: false },
});
