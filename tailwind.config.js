/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        podium: ['"FSP DEMO - PODIUM Sharp 4.11"', 'Impact', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
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
