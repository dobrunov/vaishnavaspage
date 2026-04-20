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
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
