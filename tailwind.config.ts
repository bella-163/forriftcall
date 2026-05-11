import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rift: {
          bg: "#09070d",
          panel: "#15101a",
          crimson: "#d92d45",
          violet: "#8b5cf6",
          gold: "#d8a74f",
          blue: "#4aa3ff",
        },
      },
      boxShadow: {
        glow: "0 0 32px rgba(217, 45, 69, 0.28)",
      },
      backgroundImage: {
        "rift-radial": "radial-gradient(circle at top, rgba(139,92,246,.22), transparent 40%), radial-gradient(circle at left, rgba(217,45,69,.22), transparent 35%)",
      },
    },
  },
  plugins: [],
};

export default config;
