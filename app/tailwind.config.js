/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "back-light":
          "radial-gradient(50% 50% at 50% 50%, rgba(0, 174, 233, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
        "back-dark":
          "radial-gradient(50% 50% at 50% 50%, rgba(33, 114, 229, 0.1) 0%, rgba(33, 36, 41, 0) 100%)",
      },
      keyframes: {
        "spinner-rotate-anim": {
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        "spinner-stroke-anim": {
          "0%": {
            "stroke-dasharray": "0 150",
            "stroke-dashoffset": "0",
          },
          "47.5%": {
            "stroke-dasharray": "42 150",
            "stroke-dashoffset": "-16",
          },
          "95%, 100%": {
            "stroke-dasharray": "42 150",
            "stroke-dashoffset": "-59",
          },
        },
      },
    },
  },
  plugins: [],
};
