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
          DEFAULT: '#0062B8',
          foreground: '#FFFFFF',
          50:  '#F0F6FC',
          100: '#D2E5F9',
          200: '#A1CCF7',
          300: '#66ADF5',
          400: '#258CF4',
          500: '#0062B8',
          600: '#06498C',
          700: '#03326A',
          800: '#02244D',
          900: '#011632',
          hover: '#06498C',
          dark:  '#002962',
          light: '#F0F6FC',
          hl:    '#D2E5F9',
        },
        accent: {
          DEFAULT: '#FF6B00',
          foreground: '#FFFFFF',
          50:  '#FFF4E8',
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
          DEFAULT: '#FFDA6C',
          foreground: '#1A1A1A',
          50:  '#FFFCF2',
          100: '#FFF5DB',
          200: '#FFEDBD',
          300: '#FFE396',
          400: '#FFDA6C',
          500: '#FCC42C',
          600: '#D59D0E',
          700: '#9C7211',
          800: '#694C11',
          900: '#412E0E',
        },
        sale: {
          DEFAULT: '#E63946',
        },
        surface:    '#F7F8FA',
        border:     '#DCE3EC',
        background: '#F7F8FA',
        foreground: '#1A1A2E',
        muted: {
          DEFAULT:    '#E8ECF2',
          foreground: '#4A5E78',
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
        input: '#DCE3EC',
        ring:  '#0062B8',
        charcoal: {
          900: '#06141B',
          800: '#11212D',
          700: '#253745',
          500: '#4A5C6A',
          300: '#9BA8AB',
          100: '#CCD0CF',
        },
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
