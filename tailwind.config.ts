import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fdf0f0',
          100: '#f9dede',
          200: '#f2c8c8',
          300: '#e8a0a0',
          400: '#d97070',
          500: '#c97b7b',
          600: '#9b4e4e',
        },
        lavender: {
          50: '#f2effe',
          100: '#e4dffd',
          200: '#d8cff5',
          300: '#b8a8e8',
          400: '#9880d8',
          500: '#7b6bbf',
          600: '#5a4d9e',
        },
        mint: {
          50: '#edf7f2',
          100: '#d4ede2',
          200: '#b8e4cc',
          300: '#84c9a8',
          400: '#4a9b6f',
          500: '#3a7d58',
        },
        cream: {
          50: '#fdfaf6',
          100: '#f7f2eb',
          200: '#ede5d8',
        },
        ink: {
          DEFAULT: '#2e2626',
          light: '#5c4e4e',
          muted: '#9b8888',
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        prose: ['"Crimson Pro"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 2px 14px rgba(140,90,90,0.07)',
        'soft-lg': '0 8px 30px rgba(140,90,90,0.11)',
        'inner-soft': 'inset 0 1px 4px rgba(140,90,90,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease both',
        'slide-up': 'slideUp 0.35s ease both',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
}
export default config
