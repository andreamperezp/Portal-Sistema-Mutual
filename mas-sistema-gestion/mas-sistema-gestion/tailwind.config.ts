import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT: "#56a5a1", dark: "#357572", light: "#94d4d4", pale: "#eaf5f4" },
        brandyellow: { DEFAULT: "#f4a721", light: "#fcc640", pale: "#fef3e0" },
        ink: { DEFAULT: "#3d3d3b", gray: "#6f6f71" },
        line: "#ececeb",
        bg: "#f7f7f6",
        brandred: { DEFAULT: "#e0554f", pale: "#fdf1f0" },
      },
      fontFamily: {
        sans: ["Nunito Sans", "sans-serif"],
        display: ["Liebling", "Nunito Sans", "sans-serif"],
      },
      borderRadius: {
        xl2: "18px",
      },
    },
  },
  plugins: [],
};

export default config;
