import { defineConfig } from 'vite';

/** Для GitHub Pages (підкаталог): VITE_BASE_PATH=/repo-name/ — задає workflow */
const base = process.env.VITE_BASE_PATH ?? '/';

export default defineConfig({
  base,
  publicDir: 'public',
  build: {
    target: 'es2022',
    reportCompressedSize: false,
  },
  css: {
    devSourcemap: true,
  },
});
