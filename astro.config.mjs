// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://Joshua-Guo.github.io',
  base: '/ai-product_manager-map',
  integrations: [react(), mdx()],
});
