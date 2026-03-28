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
        paper: "#fcfaf7",
        midnight: "#1a2744",
        oat: "#F5F5F4",
        champagne: "#d4c5a9"
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        serif: ["var(--font-display)"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(17, 17, 17, 0.08)",
        glass: "0 4px 20px rgba(0,0,0,0.03)",
        "glass-hover": "0 8px 32px rgba(0,0,0,0.06)",
        elegant: "0 24px 64px rgba(26,39,68,0.06)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to right, rgba(17,17,17,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.06) 1px, transparent 1px)"
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
