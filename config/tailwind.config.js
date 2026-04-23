/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.html',
    './src/**/*.{html,js,css}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#e85d04',
          dark: '#d45504',
          light: '#ff7b1c',
        },
        /** Footer (logo ref: warm cream + #F26522) — used from site-chrome.js */
        footer: {
          cream: '#FDF0E0',
          ink: '#5c4a3d',
          muted: '#6b5c4d',
          accent: '#F26522',
          accentHover: '#d14a10',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
