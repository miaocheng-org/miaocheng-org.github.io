// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://miaocheng-org.github.io',
  // If deploying to https://YOUR_USERNAME.github.io/REPO_NAME, add:
  // base: '/REPO_NAME',
  vite: {
    plugins: [tailwindcss()]
  }
});