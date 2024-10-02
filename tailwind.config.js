/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "jort": "#1495ce",
      },
      fontFamily: {
        sans: ["Montserrat", "Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}

