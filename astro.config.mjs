// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// On GitHub Pages the site lives under /v3; locally and on the final hosting it lives at the root.
const onPages = process.env.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
  site: onPages ? 'https://ejallo.github.io' : undefined,
  base: onPages ? '/v3' : '/',
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});
