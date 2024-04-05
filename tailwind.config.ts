import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
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
      primary: {
        light: "#a8dadc",
        dark: "#457b9d",
        inactive: "#e8f1f2",
      },
      secondary: {
        light: "#f1faee",
        dark: "#a8bfa4",
        inactive: "#f7faf7",
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
      // "base-100": {
      //   light: "#fbffde",
      //   dark: "#c8ccad",
      //   inactive: "#fdfef2",
      // },
      info: {
        light: "#40b1d6",
        dark: "#006885",
        inactive: "#bfe8f2",
      },
      success: {
        light: "#5ac200",
        dark: "#116600",
        inactive: "#d8e6bf",
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
      1: "8px",
      2: "12px",
      3: "16px",
      4: "24px",
      5: "32px",
      6: "48px",
    },
    // ...
    extend: {
      opacity: {
        "80": ".8",
      },
      inset: {
        "1/2": "50%",
      },
    },
  },
  // variants: {
  //   extend: {
  //     borderColor: ["focus-visible"],
  //     opacity: ["disabled"],
  //   },
  // },
  plugins: [],
};
export default config;
