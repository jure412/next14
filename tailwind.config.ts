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
      1: "1px",
      2: "2px",
      3: "4px",
      4: "6px",
      5: "8px",
      6: "12px",
      7: "16px",
      8: "24px",
      9: "32px",
      10: "40px",
      11: "48px",
      12: "-1px",
      13: "64px",
      14: "96px",
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
  // variants: {
  //   extend: {
  //     borderColor: ["focus-visible"],
  //     opacity: ["disabled"],
  //   },
  // },
  plugins: [],
};
export default config;
