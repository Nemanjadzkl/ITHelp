/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        surface: '#1E1E1E',
        primary: '#BB86FC',
        error: '#CF6679',
      },
      scale: {
        102: '1.02',
      },
    },
  },
  plugins: [],
};