/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      clipPath: {
        pentagon: 'polygon(50% 0%, 100% 35%, 82% 100%, 18% 100%, 0% 35%)',
      },
      boxShadow: {
        'custom': 'rgba(17, 17, 26, 0.1) 0px 0px 16px',
      },
      colors:{
brown:'#886c44',
Grey:'#f0ece4',
dblack:'#201c1c',
      },
      fontFamily: {
        poppins: ["poppins", "sans-serif"], // Adding Poppins to the theme
      },
    },
  },
  plugins: [],
}
