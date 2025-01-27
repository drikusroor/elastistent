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
      spacing: {
        18: '4.5rem',
        21: '5.25rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
        35: '8.75rem',
        37: '9.25rem',
        38: '9.5rem',
      },
    },
  },
  plugins: [],
}

