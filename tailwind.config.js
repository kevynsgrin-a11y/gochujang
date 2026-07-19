/** @type {import('tailwindcss').Config} */

// Semantic color tokens are driven by CSS custom properties (src/index.css) as
// space-separated RGB channels, so Tailwind opacity utilities keep working
// (bg-primary/40) and the light/dark swap is a single class toggle.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`
const cssVar = (name) => `var(--${name})`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-alt': token('surface-alt'),
        elevated: token('elevated'),
        ink: token('text'),
        muted: token('text-muted'),
        subtle: token('text-subtle'),
        line: token('border'),
        primary: { DEFAULT: token('primary'), fg: token('primary-fg') },
        secondary: { DEFAULT: token('secondary'), fg: token('secondary-fg') },
        accent: { DEFAULT: token('accent'), fg: token('accent-fg') },
        ember: token('ember'),
        persimmon: token('persimmon'),
        plum: token('plum'),
        celadon: token('celadon'),
        success: token('success'),
        warning: token('warning'),
        danger: token('danger'),
      },
      fontFamily: {
        display: [cssVar('font-display'), 'Georgia', 'serif'],
        sans: [cssVar('font-body'), 'system-ui', 'sans-serif'],
        accent: [cssVar('font-accent'), 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-hero': ['clamp(2.75rem, 7vw + 1rem, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.025em' }],
        'display-xl': ['clamp(2.25rem, 4.5vw + 0.5rem, 4.5rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        h1: ['clamp(1.9rem, 2.6vw + 0.5rem, 3.25rem)', { lineHeight: '1.03', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.5rem, 1.6vw + 0.6rem, 2.25rem)', { lineHeight: '1.06', letterSpacing: '-0.015em' }],
        h3: ['clamp(1.15rem, 0.6vw + 0.9rem, 1.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'body-lg': ['clamp(1.075rem, 0.4vw + 0.95rem, 1.3rem)', { lineHeight: '1.7' }],
        body: ['clamp(0.95rem, 0.2vw + 0.9rem, 1.05rem)', { lineHeight: '1.65' }],
        caption: ['clamp(0.8rem, 0.1vw + 0.78rem, 0.875rem)', { lineHeight: '1.4' }],
        eyebrow: ['clamp(0.68rem, 0.05vw + 0.66rem, 0.78rem)', { lineHeight: '1.2' }],
        data: ['clamp(0.9rem, 0.3vw + 0.85rem, 1.15rem)', { lineHeight: '1.2' }],
      },
      borderRadius: {
        xs: '4px',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        card: 'var(--radius-card)',
        modal: 'var(--radius-modal)',
        glyph: 'var(--radius-glyph)',
        pill: '999px',
        chip: '999px',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        lift: '0 22px 50px -12px rgba(0, 0, 0, 0.45)',
        ember: 'var(--shadow-ember)',
        'ember-lg': 'var(--shadow-ember-lg)',
        'inset-dark': 'var(--shadow-inset-dark)',
      },
      backgroundImage: {
        'grad-ember': 'linear-gradient(135deg, #C63A20 0%, #E8542E 45%, #F0873F 100%)',
        'grad-ember-radial': 'radial-gradient(120% 120% at 20% 0%, #F0873F 0%, #C63A20 55%, #7A1E12 100%)',
        'grad-fallback-crimson': 'linear-gradient(160deg, #7A1E12 0%, #C63A20 60%, #D9622C 100%)',
        'grad-fallback-charcoal': 'linear-gradient(165deg, #292019 0%, #1F1815 55%, #161210 100%)',
        'grad-plum-funk': 'linear-gradient(150deg, #3A1C2E 0%, #5E2A3E 50%, #8A3A2C 100%)',
        'grad-celadon-fresh': 'linear-gradient(150deg, #1F3A30 0%, #3E7C63 60%, #7FBF9E 100%)',
        'grad-duotone-ink': 'linear-gradient(180deg, rgba(22,18,16,0.10) 0%, rgba(22,18,16,0.72) 100%)',
        'grad-paper-sheen': 'radial-gradient(140% 100% at 50% -20%, #FBF7F0 0%, #F5EFE6 55%, #EFE6D8 100%)',
      },
      maxWidth: {
        content: '1240px',
        prose: '68ch',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      transitionTimingFunction: {
        edible: 'cubic-bezier(0.22, 1, 0.36, 1)',
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1.09)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'ember-pulse': {
          '0%,100%': { opacity: '0.85', filter: 'drop-shadow(0 0 2px rgba(240,135,63,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(240,135,63,0.75))' },
        },
        'flame-flicker': {
          '0%,100%': { transform: 'scale(1) rotate(-1deg)', opacity: '0.9' },
          '50%': { transform: 'scale(1.06) rotate(1deg)', opacity: '1' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'ken-burns': 'ken-burns 9s ease-out both',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'ember-pulse': 'ember-pulse 3s ease-in-out infinite',
        'flame-flicker': 'flame-flicker 3s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'spin-slow': 'spin-slow 34s linear infinite',
      },
    },
  },
  plugins: [],
}
