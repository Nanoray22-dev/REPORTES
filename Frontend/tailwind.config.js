/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: {
          100: "#fd8e00",
          200: "#FB8E25"
        },
        third:{
          100: "#1B385C",
          200: "#1A375B",
          300: "#344C6A"
        },
        primary: {
          100: "#3A00B0",
          300: "#29007D",
          900: "#120037",
        },
      },
    },
  },
  plugins: [],
};
