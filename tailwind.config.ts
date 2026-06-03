import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        mist: "rgb(var(--mist) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        forest: "rgb(var(--forest) / <alpha-value>)",
        coral: "rgb(var(--coral) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        sky: "rgb(var(--sky) / <alpha-value>)"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(22, 33, 28, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
