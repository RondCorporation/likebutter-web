import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
        pretendard: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
        'archivo-black': ['var(--font-archivo-black)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': {
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
          },
          '50%': {
            backgroundSize: '120% 120%',
            backgroundPosition: 'center',
          },
        },
      },
      colors: {
        accent: 'var(--accent)',
        'gradient-start': '#0f2027',
        'gradient-middle': '#203a43',
        'gradient-end': '#2c5364',
        'butter-yellow': '#FFD84D',
        'butter-orange': '#FF9E2C',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
