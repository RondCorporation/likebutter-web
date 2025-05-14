import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        blink: { '0%,60%': { opacity: '1' }, '60%,100%': { opacity: '0' } },
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        cursor: 'blink 1s steps(2) infinite',
        'wave-slow': 'wave 12s linear infinite',
        'wave-mid': 'wave 8s  linear infinite',
        'wave-fast': 'wave 4s  linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
