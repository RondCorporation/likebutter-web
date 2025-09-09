import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
        pretendard: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Segoe UI',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'Malgun Gothic',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'sans-serif',
        ],
        'archivo-black': ['var(--font-archivo-black)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        fadeIn: 'fadeIn 0.15s ease-out forwards',
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
        fadeIn: {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
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
        // Studio2 Design System Colors
        studio: {
          header: '#292c31',
          main: '#323232',
          content: '#25282c',
          sidebar: '#202020',
          'sidebar-dark': '#1a1a1a',
          border: '#313131',
          'border-light': '#313131',
          'border-subtle': '#333333',
          text: {
            primary: '#ffffff',
            secondary: '#a8a8aa',
            muted: '#89898b',
            dim: '#6b6b6d',
          },
          button: {
            primary: '#ffd93b',
            'primary-alt': '#ffd83b',
            hover: '#ffcc00',
            disabled: '#999999',
          },
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#ef4444',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
