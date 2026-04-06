/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./categories/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0071BC",
          pink: "#E91E63",
          yellow: "#F5C518",
          red: "#E53935",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          '"Plus Jakarta Sans"',
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.55s ease-out forwards",
      },
    },
  },
  plugins: [],
};
