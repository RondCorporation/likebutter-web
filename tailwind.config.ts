import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        blink: { '0%,60%': { opacity: '1' }, '60%,100%': { opacity: '0' } },
        wave: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(155px,0,0)' },
        },
      },
      animation: {
        cursor: 'blink 1s steps(2) infinite',
        'wave-slow': 'wave 12s ease-in-out infinite',
        'wave-mid': 'wave 8s  ease-in-out infinite',
        'wave-fast': 'wave 4s  ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
