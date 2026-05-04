/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        body:    ['Barlow', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
      colors: {
        zinc: {
          950: '#09090b',
        },
      },
    },
  },
  plugins: [],
}
