import { heroui } from '@heroui/theme';
import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(accordion|alert|avatar|button|card|checkbox|chip|divider|drawer|dropdown|input|link|listbox|navbar|progress|select|skeleton|spacer|popover|user|ripple|spinner|form|modal|menu|scroll-shadow).js"
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: '#121212',
          },
        },
      },
    }),
  ],
} satisfies Config;
