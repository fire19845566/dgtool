import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: replace with your real domain before deploying
export default defineConfig({
  site: 'https://dgtool.io',
  integrations: [sitemap()],
});
