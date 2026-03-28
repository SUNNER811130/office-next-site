import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        stone: "#f5f1ea",
        mist: "#d9d1c5",
        bronze: "#83684a",
        slate: "#5d6268",
        paper: "#fcfaf7"
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        serif: ["var(--font-display)"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(17, 17, 17, 0.08)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to right, rgba(17,17,17,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
