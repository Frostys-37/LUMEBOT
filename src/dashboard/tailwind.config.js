export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        neu: {
          bg: "#2c2f36",
          text: "#d5d8e0",
          muted: "#8a8f9a",
          blue: "#6d8bff",
        },
      },
      boxShadow: {
        neu: "9px 9px 18px rgba(0,0,0,0.55), -9px -9px 18px rgba(255,255,255,0.035)",
        "neu-sm": "5px 5px 10px rgba(0,0,0,0.5), -5px -5px 10px rgba(255,255,255,0.03)",
        "neu-inset": "inset 4px 4px 8px rgba(0,0,0,0.5), inset -4px -4px 8px rgba(255,255,255,0.03)",
        "neu-inset-sm": "inset 2px 2px 4px rgba(0,0,0,0.45), inset -2px -2px 4px rgba(255,255,255,0.03)",
      },
    },
  },
  plugins: [],
};