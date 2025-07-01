import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lendora: {
          50: "#FFE4EC",
          100: "#FFB3C5",
          200: "#FF809D",
          300: "#FF4D75",
          400: "#FE285C",
          500: "#FE1251", // primary
          600: "#D20E45",
          700: "#A50B38",
          800: "#78082B",
          900: "#4B051E",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
