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
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        }
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)", 
        3: "var(--space-3)",
        4: "var(--space-4)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        12: "var(--space-12)",
        16: "var(--space-16)",
      },
      fontSize: {
        'heading-1': ['32px', '48px'],
        'heading-2': ['24px', '36px'],
        'heading-3': ['20px', '30px'],
        'body-lg': ['18px', '28px'],
        'body': ['16px', '24px'],
        'body-sm': ['14px', '20px'],
      }
    },
  },
  plugins: [],
} satisfies Config;
