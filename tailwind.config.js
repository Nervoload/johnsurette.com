/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        "3xl": "1920px",
      },
      spacing: {
        safe: "env(safe-area-inset-bottom, 0px)",
      },
      height: {
        "screen-dvh": "100dvh",
      },
      minHeight: {
        "screen-dvh": "100dvh",
      },
    },
  },
  plugins: [],
};
