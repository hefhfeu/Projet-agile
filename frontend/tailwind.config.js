/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#0f766e',
          600: '#0d9488',
          700: '#115e59',
          800: '#134e4a',
          900: '#042f2e',
        }
      }
    },
  },
  plugins: [],
}

