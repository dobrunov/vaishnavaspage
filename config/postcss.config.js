import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Path to tailwind.config.js next to this file (PostCSS is invoked from the project root). */
export default {
  plugins: {
    tailwindcss: {
      config: path.join(__dirname, 'tailwind.config.js'),
    },
    autoprefixer: {},
  },
};
