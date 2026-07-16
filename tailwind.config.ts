import typography from "@tailwindcss/typography";
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
        ink: "#101418",
        stone: "#EEF2F5",
        mist: "#D7DEE5",
        bronze: "#6E7F8F",
        slate: "#53606C",
        paper: "#F8FAFC",
        midnight: "#071A2F",
        oat: "#F3F6F8",
        champagne: "#6EA7BF"
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        serif: ["var(--font-display)"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(7, 26, 47, 0.08)",
        glass: "0 4px 20px rgba(0,0,0,0.03)",
        "glass-hover": "0 8px 32px rgba(7,26,47,0.08)",
        elegant: "0 24px 64px rgba(7,26,47,0.10)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to right, rgba(7,26,47,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(7,26,47,0.06) 1px, transparent 1px)"
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem"
      }
    }
  },
  plugins: [typography]
};

export default config;
