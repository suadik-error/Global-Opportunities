/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6671E4",
          light: "#8B95FF",
          dark: "#3654FF",
          transparent: "rgba(102, 113, 228, 0.1)",
        },
        background: {
          DEFAULT: "#F3F3F3",
          alt: "#F6F7F9",
          card: "#FFFFFF",
        },
        text: {
          DEFAULT: "#000000",
          muted: "#595959",
          light: "#1A1A1A",
        },
        success: "#16A34A",
        error: "#ED4C5C",
        warning: "#F6B612",
        border: "#E5E6F2",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}
