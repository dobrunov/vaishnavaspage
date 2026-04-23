import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');

/** GitHub Pages (subpath): VITE_BASE_PATH=/repo-name/ — set by the workflow */
const base = process.env.VITE_BASE_PATH ?? '/';

export default defineConfig({
  root,
  base,
  publicDir: 'public',
  build: {
    target: 'es2022',
    reportCompressedSize: false,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        donate: resolve(root, 'donate.html'),
        donations: resolve(root, 'donations.html'),
        darshan: resolve(root, 'darshan.html'),
        schedule: resolve(root, 'schedule.html'),
        broadcast: resolve(root, 'broadcast.html'),
        education: resolve(root, 'education.html'),
        howToGet: resolve(root, 'how-to-get.html'),
        events: resolve(root, 'events.html'),
        contacts: resolve(root, 'contacts.html'),
        harinamyUMisti: resolve(root, 'harinamy-u-misti.html'),
        kirtanVaishnavi: resolve(root, 'kirtan-vaishnavi.html'),
        krishnaKatha: resolve(root, 'krishna-katha.html'),
        shkolaBhakti: resolve(root, 'shkola-bhakti.html'),
        zhenskayaNamaHatta: resolve(root, 'zhenskaya-nama-hatta.html'),
        vaishnavskeSvyato: resolve(root, 'vaishnavske-svyato.html'),
      },
    },
  },
  css: {
    devSourcemap: true,
    postcss: resolve(__dirname, 'postcss.config.js'),
  },
});
