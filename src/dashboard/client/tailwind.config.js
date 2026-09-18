export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        discord: {
          bg: "#17181b",
          surface: "#2b2d31",
          surface2: "#232428",
          border: "#3a3c41",
          blurple: "#5865f2",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};