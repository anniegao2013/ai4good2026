import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        faro: {
          primary:   "#1D9E75",
          light:     "#E1F5EE",
          dark:      "#085041",
          surface:   "#f8f8f6",
          border:    "#e5e5e3",
        },
        text: {
          primary:   "#1a1a1a",
          secondary: "#666666",
        },
      },
    },
  },
  plugins: [],
};
export default config;
