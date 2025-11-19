/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rift: {
          900: '#0a0a12', // Void black
          800: '#151520', // Deep background
          700: '#2a2a35', // Card background
          600: '#3f3f4e', // Border
          500: '#6366f1', // Primary accent (Indigo)
          400: '#818cf8', // Secondary accent
          300: '#a5b4fc', // Highlight
          100: '#e0e7ff', // Text light
        },
        void: '#050505',
        gold: '#ffd700',
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
