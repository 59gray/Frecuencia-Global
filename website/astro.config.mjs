// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.FG_WEBSITE_URL ?? 'https://frecuenciaglobal.vercel.app',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()],
});
