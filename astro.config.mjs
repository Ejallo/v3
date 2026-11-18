// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Keep in sync with SITE_URL in src/config.ts
  site: 'https://vvdigital.de',
  integrations: [react()],
  // Inline the CSS into each page: one less render-blocking request
  build: { inlineStylesheets: 'always' },

  // CSP <meta> with a hash for every inline script Astro emits, so injected script can't run.
  // The rest of the policy (frame-ancestors, connect-src, …) is the header in public/_headers;
  // the browser enforces both, so keep the script sources in the two places in sync.
  security: {
    csp: {
      scriptDirective: {
        resources: ["'self'", 'https://challenges.cloudflare.com'],
      },
      // React and Radix set style attributes; hashes can't cover those, so styles stay inline-allowed.
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'"],
      },
    },
  },

  vite: {
    plugins: [tailwindcss()]
  }
});
