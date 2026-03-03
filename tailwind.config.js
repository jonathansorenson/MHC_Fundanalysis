/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'mhc-navy': '#0A1628',
        'mhc-card': '#0F2236',
        'mhc-border': '#1E3347',
        'mhc-accent': '#5B8DEF',
        'mhc-teal': '#5B8DEF',
        'mhc-red': '#E06B6B',
        'mhc-muted': '#8A9BB0',
        'mhc-gold': '#4CAF82',
        'mhc-sage': '#4CAF82',
        'mhc-amber': '#E8A838',
        'mhc-plum': '#9B7FD4',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(91,141,239,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(91,141,239,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
