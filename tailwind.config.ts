import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        inksoft: "#1e293b",
        teal: { DEFAULT: "#0d9488", dark: "#0f766e" },
        amber: { DEFAULT: "#f59e0b", dark: "#d97706" },
      },
      borderRadius: { xl2: "14px" },
    },
  },
  plugins: [],
};
export default config;
