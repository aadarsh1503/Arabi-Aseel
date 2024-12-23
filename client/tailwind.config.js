/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
brown:'#886c44',
Grey:'#f0ece4',
      },
      fontFamily: {
        poppins: ["poppins", "sans-serif"], // Adding Poppins to the theme
      },
    },
  },
  plugins: [],
}
