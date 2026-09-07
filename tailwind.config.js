/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bone: {
          DEFAULT: '#E8E2D6',
        },
        crimson: {
          DEFAULT: '#DF3640',
          light: '#F05A62',
        },
        gold: {
          DEFAULT: '#C6A75E',
        },
      },
    },
  },
  plugins: [],
};
