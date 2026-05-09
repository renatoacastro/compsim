/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: 'var(--bg)',
          surface: 'var(--bg-surface)',
          card:    'var(--bg-card)',
          border:  'var(--bg-border)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
        },
        accent: {
          blue:   '#3b82f6',
          cyan:   '#06b6d4',
          green:  '#22c55e',
          orange: '#f97316',
          purple: '#a855f7',
          yellow: '#eab308',
          red:    '#ef4444',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
