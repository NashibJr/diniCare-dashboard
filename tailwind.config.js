/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff1f7",
          100: "#ffe3ef",
          200: "#ffc6df",
          300: "#ff96c2",
          400: "#ff5b9e",
          500: "#f72585",
          600: "#db146e",
          700: "#b70d59",
          800: "#970f4c",
          900: "#7e1142"
        },
        secondary: "#f8c700"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15,23,42,.08)"
      }
    }
  },
  plugins: []
};
