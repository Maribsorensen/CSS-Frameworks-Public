/** @type {import('tailwindcss').Config} */
export default {
  content: ["./**/*.{html,js,ts}", "!./node_modules/**/*"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Frank Ruhl Libre", "sans-serif"],
        body: ["Nunito Sans", "sans-serif"],
        logo: ["Amita", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#AAC8A7",
          light: "#F6FFDE",
          hover: "#8cb488",
          triadic: "#c8a7aa",
          triadic_hover: "#b4888c",
        },
      },
    },
  },
  plugins: [],
}
