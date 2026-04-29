export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#006747',
          700: '#15803d',
          900: '#14532d',
        },
        gold: {
          300: '#fde68a',
          400: '#F4B942',
          500: '#f59e0b',
        },
        navy: {
          800: '#0f172a',
          900: '#0A1628',
          950: '#060d1a',
        },
        surface: {
          DEFAULT: '#111827',
          2:       '#1a2235',
          3:       '#1f2d42',
          border:  '#1e3a5f',
        },
      },
      animation: {
        'fade-up':  'fadeUp .4s ease forwards',
        'fade-in':  'fadeIn .3s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}