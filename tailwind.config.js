/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lol: {
          950: '#010A13',  // Darkest background
          900: '#0A1428',  // Dark background
          850: '#0E1923',  // Card background
          800: '#1E2328',  // Border dark
          700: '#463714',  // Bronze border
          600: '#5B5A56',  // Text muted
          500: '#785A28',  // Bronze
          400: '#A09B8C',  // Text secondary
          300: '#C89B3C',  // Gold accent
          200: '#C8AA6E',  // Light gold
          100: '#F0E6D2',  // Cream text
        },
        hextech: {
          cyan: '#0AC8B9',
          teal: '#0397AB',
        },
        // Keep old rift colors for gradual migration
        rift: {
          900: '#0a0a12',
          800: '#151520',
          700: '#2a2a35',
          600: '#3f3f4e',
          500: '#6366f1',
          400: '#818cf8',
          300: '#a5b4fc',
          100: '#e0e7ff',
        },
      },
      fontFamily: {
        fantasy: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
