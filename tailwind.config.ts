import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        paper: {
          DEFAULT: "#FBF9F5",
          warm: "#F4F1EA",
          card: "#FFFFFF",
          muted: "#EFECE4",
          border: "#E5E0D5",
          borderStrong: "#D2CBB8",
        },
        ink: {
          DEFAULT: "#141413",
          secondary: "#4A4842",
          muted: "#78756E",
          faint: "#A39E93",
        },
        accent: {
          forest: "#1B4332",
          forestLight: "#E9F2EE",
          terracotta: "#B84A27",
          terracottaLight: "#F9ECE8",
          ochre: "#9A6B1F",
          ochreLight: "#FBF4E6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
