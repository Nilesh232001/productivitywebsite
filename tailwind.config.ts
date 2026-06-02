import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16211c",
        mist: "#eef3f0",
        line: "#dbe4df",
        forest: "#1f6b4f",
        coral: "#d85f4a",
        gold: "#d99b2b",
        sky: "#3279a8"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(22, 33, 28, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
