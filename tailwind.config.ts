import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      background: "#a8bfa4",
      primary: {
        light: "#a8dadc",
        dark: "#457b9d",
        inactive: "#e8f1f2",
      },
      secondary: {
        light: "#e6e6ff",
        dark: "#9999cc",
        inactive: "#f2f2ff",
      },
      accent: {
        light: "#ff7f40",
        dark: "#cc3f00",
        inactive: "#ffd9bf",
      },
      neutral: {
        light: "#4f5454",
        dark: "#0f1615",
        inactive: "#9fa2a1",
      },
      info: {
        light: "#40b1d6",
        dark: "#006885",
        inactive: "#bfe8f2",
      },
      success: {
        light: "#e9f8cb",
        dark: "#a3c293",
        inactive: "#f1f8e4",
      },
      warning: {
        light: "#e6b640",
        dark: "#9c6400",
        inactive: "#f7e2bf",
      },
      error: {
        light: "#ff8fa3",
        dark: "#cc6f7e",
        inactive: "#ffe2e7",
      },
    },
    spacing: {
      0: "0",
      1: "2px",
      2: "4px",
      3: "8px",
      4: "12px",
      5: "16px",
      6: "20px",
      7: "24px",
      8: "28px",
      9: "32px",
      10: "36px",
      11: "40px",
      12: "44px",
      13: "48px",
      14: "72px",
      15: "96px",
    },
    // ...
    extend: {
      boxShadow: {
        primary:
          "0 10px 15px 0px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
        none: "unset",
      },
      opacity: {
        "80": ".8",
      },
      inset: {
        "1/2": "50%",
      },
    },
  },
  plugins: [],
};
export default config;
