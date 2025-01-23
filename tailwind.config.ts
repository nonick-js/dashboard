import { heroui } from '@heroui/theme';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/components/(accordion|alert|avatar|button|card|checkbox|chip|code|divider|drawer|dropdown|form|input|link|listbox|navbar|progress|select|skeleton|snippet|spacer|toggle|popover|user|ripple|spinner|modal|menu|scroll-shadow).js',
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
        light: {
          colors: {
            background: '#f4f4f5',
          },
        },
      },
    }),
  ],
} satisfies Config;
