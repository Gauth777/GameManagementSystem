import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0E1A",
        surface: "#0F1523",
        "surface-2": "#151D2E",
        border: "#1E2D4A",
        primary: "#C89B3C",
        "primary-dim": "#9B6E1F",
        accent: "#0BC4FF",
        "accent-2": "#FF4655",
        text: "#F0E6D3",
        "text-muted": "#7A8BA0",
        success: "#00D4A4",
        warning: "#FFB347",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-rajdhani)", "system-ui", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C89B3C 0%, #E8C56D 50%, #C89B3C 100%)",
        "cyan-gradient": "linear-gradient(135deg, #0BC4FF 0%, #0891B2 100%)",
        "dark-gradient": "linear-gradient(180deg, #0A0E1A 0%, #0F1523 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
