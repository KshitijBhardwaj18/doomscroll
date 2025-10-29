/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#1a1a1a",
        accent: "#3373fe",
        fill: "#3aff76",
        light: { 100: "#D6C6FF", 200: "#A8B5DB", 300: "#9CA4AB" },
        dark: { 100: "#221f3d", 200: "#0f0d23" },
      },
      fontFamily: {
        sans: ["Poppins_400Regular"],
        medium: ["Poppins_500Medium"],
        semibold: ["Poppins_600SemiBold"],
        bold: ["Poppins_700Bold"],
      },
    },
  },
  plugins: [],
};
