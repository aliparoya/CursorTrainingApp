import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        'slide-fade-in': {
          '0%': { 
            transform: 'translateX(20px)',
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1' 
          },
        },
        'slide-fade-out': {
          '0%, 100%': { 
            transform: 'translateX(20px)',
            opacity: '0' 
          },
          '50%': { 
            transform: 'translateX(0)',
            opacity: '1' 
          },
        }
      },
      animation: {
        'slide-fade-in': 'slide-fade-in 0.3s ease-out forwards',
        'slide-fade-out': 'slide-fade-out 0.6s ease-in-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
