import { nextui } from '@nextui-org/theme';
import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|card|checkbox|divider|input|link|ripple|spinner|form).js"
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: '#111213',
          },
        },
        light: {
          colors: {
            background: '#f4f4f5',
          },
        },
      },
    }),
  ],
} satisfies Config;
