/** @type {import('tailwindcss').Config} */
const v = (nombre) => `rgb(var(--${nombre}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fondo: v("fondo"),
        superficie: v("superficie"),
        texto: v("texto"),
        suave: v("suave"),
        linea: v("linea"),
        acento: v("acento"),
        aire: {
          1: v("aire-1"),
          2: v("aire-2"),
          3: v("aire-3"),
          4: v("aire-4"),
          5: v("aire-5"),
        },
      },
      fontFamily: {
        sans: ['"Schibsted Grotesk Variable"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};