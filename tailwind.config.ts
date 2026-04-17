import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0064D2',   // Azul Magalu principal
          foreground: '#FFFFFF',
          50: '#E8F2FF',
          100: '#C5DCFF',
          200: '#9DC4FF',
          300: '#6BABFF',
          400: '#3D8FFF',
          500: '#0064D2',
          600: '#0054B5',
          700: '#003F8A',
          800: '#002D6B',
          900: '#001C45',
          hover: '#0054B5',
          dark: '#003F8A',
          light: '#E8F2FF',
          hl: '#C5DCFF',
        },
        accent: {
          DEFAULT: '#FF6B00',   // Laranja Magalu
          foreground: '#FFFFFF',
          50: '#FFF4E8',
          100: '#FFE2C5',
          200: '#FFCE9D',
          300: '#FFB76B',
          400: '#FF9E3D',
          500: '#FF6B00',
          600: '#E05A00',
          700: '#C04900',
          800: '#9A3800',
          900: '#702600',
          hover: '#E05A00',
        },
        gold: {
          DEFAULT: '#FFD600',
          foreground: '#1A1A1A',
          50: '#FFFDE8',
          100: '#FFFAC5',
          200: '#FFF59D',
          300: '#FFEE6B',
          400: '#FFE53D',
          500: '#FFD600',
          600: '#E0BB00',
          700: '#C09B00',
          800: '#9A7C00',
          900: '#705800',
        },
        sale: {
          DEFAULT: '#E63946',
        },
        surface: '#F2F6FC',
        border: '#C4D4E8',
        background: '#F2F6FC',
        foreground: '#1A1A2E',
        muted: {
          DEFAULT: '#E8F0FB',
          foreground: '#4A6080',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1A1A2E',
        },
        destructive: {
          DEFAULT: '#E63946',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#22C55E',
          foreground: '#FFFFFF',
        },
        input: '#C4D4E8',
        ring: '#0064D2',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,40,100,0.08)',
        'card-hover': '0 4px 12px rgba(0,40,100,0.14)',
        lg: '0 12px 32px rgba(0,40,100,0.15)',
      },
      keyframes: {
        'border-beam': {
          '100%': { 'offset-distance': '100%' },
        },
        shimmer: {
          '0%, 90%, 100%': { 'background-position': 'calc(-100% - var(--shimmer-width)) 0' },
          '30%, 60%': { 'background-position': 'calc(100% + var(--shimmer-width)) 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        gradient: {
          to: { backgroundPosition: 'var(--bg-size) 0' },
        },
      },
      animation: {
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        shimmer: 'shimmer 8s infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        marquee: 'marquee var(--duration) infinite linear',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        gradient: 'gradient 8s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
