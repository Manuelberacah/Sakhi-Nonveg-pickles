/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brandBlack: "#0F0F0F",
        brandRed: "#C10F1A",
        brandYellow: "#F6BE00"
      },
      boxShadow: {
        brand: "0 14px 34px rgba(193, 15, 26, 0.18)"
      }
    }
  },
  plugins: []
};
