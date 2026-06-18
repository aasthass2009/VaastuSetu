import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: "#C05A12",
          50: "#fdf3ec",
          100: "#fae4d1",
          200: "#f4c49e",
          300: "#eda06b",
          400: "#e57c3d",
          500: "#C05A12",
          600: "#a04a0f",
          700: "#7e3a0c",
          800: "#5c2a09",
          900: "#3a1b06",
        },
        gold: {
          DEFAULT: "#B8860B",
          50: "#fdf8e6",
          100: "#faefbf",
          200: "#f4da7a",
          300: "#e8c033",
          400: "#cfa30d",
          500: "#B8860B",
          600: "#9a6f09",
          700: "#7a5607",
          800: "#5a3f05",
          900: "#3a2803",
        },
        indigo: {
          DEFAULT: "#241B3A",
          50: "#f0eef7",
          100: "#dddaf0",
          200: "#b8b2e0",
          300: "#9189cf",
          400: "#6a60bc",
          500: "#4d4499",
          600: "#3a3278",
          700: "#2e2760",
          800: "#241B3A",
          900: "#160f22",
        },
        cream: {
          DEFAULT: "#FBF5EA",
          50: "#ffffff",
          100: "#fefcf7",
          200: "#FBF5EA",
          300: "#f5e9d0",
          400: "#edd9b0",
          500: "#e4c78d",
          600: "#d9b06a",
          700: "#c8944a",
          800: "#a87535",
          900: "#7f5525",
        },
        brand: {
          saffron: "#C05A12",
          gold: "#B8860B",
          indigo: "#241B3A",
          cream: "#FBF5EA",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "Cambria", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-heading)", "Georgia", "Cambria", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
