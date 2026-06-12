/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#080810',
        bg2:     '#0e0e1c',
        bg3:     '#13132a',
        purple:  '#6450ff',
        purple2: '#9c7dff',
        cyan:    '#00e5c8',
        pink:    '#ff4d8d',
        text:    '#eeeef8',
        muted:   '#7a7a9a',
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'ui-monospace', 'monospace'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 40px rgba(100,80,255,0.25)',
        'glow-cyan':   '0 0 40px rgba(0,229,200,0.20)',
        'glow-pink':   '0 0 40px rgba(255,77,141,0.22)',
        'panel':       '0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(100,80,255,0.18)',
      },
      borderColor: {
        DEFAULT: 'rgba(100,80,255,0.18)',
      },
      keyframes: {
        blink:   { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        pulse:   { '0%,100%': { transform: 'scale(1)', opacity: '0.9' }, '50%': { transform: 'scale(1.15)', opacity: '1' } },
        scan:    { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        flicker: {
          '0%,19%,21%,23%,25%,54%,56%,100%': { opacity: '1' },
          '20%,24%,55%': { opacity: '0.45' },
        },
        caret:   { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
        spin360: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        sweep:   { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        blink:   'blink 1.2s ease-in-out infinite',
        float:   'float 6s ease-in-out infinite',
        pulse:   'pulse 2s ease-in-out infinite',
        scan:    'scan 6s linear infinite',
        flicker: 'flicker 4s linear infinite',
        caret:   'caret 1s steps(2) infinite',
        spin360: 'spin360 16s linear infinite',
        sweep:   'sweep 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
