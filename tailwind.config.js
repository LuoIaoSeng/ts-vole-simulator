/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./playground/index.html",
    "./playground/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}