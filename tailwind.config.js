/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#E2383F", // red accent
        dark: "#1A1A1A", // background color
      },
    },
  },
  plugins: [],
};
