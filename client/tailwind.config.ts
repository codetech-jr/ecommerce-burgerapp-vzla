import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. Configuramos nuestras fuentes
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      // 2. Colores Corporativos
      colors: {
        primary: {
          DEFAULT: '#EA580C', // Orange-600
          light: '#FB923C',   // Orange-400
          dark: '#C2410C',    // Orange-700
        },
        surface: '#F8FAFC',   // Slate-50
      }
    },
  },
  plugins: [],
};
export default config;