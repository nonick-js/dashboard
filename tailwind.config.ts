import { nextui } from '@nextui-org/theme';
import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(alert|avatar|button|card|checkbox|chip|divider|dropdown|input|link|navbar|progress|skeleton|user|ripple|spinner|form|menu|popover).js"
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
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
