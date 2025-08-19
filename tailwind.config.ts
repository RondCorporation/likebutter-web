import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
