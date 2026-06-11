// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://USERNAME.github.io',
  vite: {
    server: {
      // Prevent stale CSS in development by disabling browser cache.
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it', 'pl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    assets: '_astro',
  },
});
