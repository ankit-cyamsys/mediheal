/** Maps token names to `rgb(var(--color-token) / <alpha-value>)`. */
function withVars(tokens) {
  return Object.fromEntries(
    tokens.map((t) => [t, `rgb(var(--color-${t}) / <alpha-value>)`]),
  );
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      // Colors resolve through CSS custom properties (see global.css + the
      // runtime theme provider in src/app/_layout.tsx) so the whole palette can
      // swap between light and dark at runtime. `<alpha-value>` keeps opacity
      // utilities like `bg-primary/10` working.
      colors: withVars([
        'primary',
        'primary-container',
        'primary-fixed',
        'primary-fixed-dim',
        'on-primary',
        'on-primary-container',
        'on-primary-fixed',
        'on-primary-fixed-variant',
        'secondary',
        'secondary-container',
        'secondary-fixed',
        'secondary-fixed-dim',
        'on-secondary',
        'on-secondary-container',
        'on-secondary-fixed',
        'on-secondary-fixed-variant',
        'tertiary',
        'tertiary-container',
        'tertiary-fixed',
        'tertiary-fixed-dim',
        'on-tertiary',
        'on-tertiary-container',
        'on-tertiary-fixed',
        'on-tertiary-fixed-variant',
        'error',
        'error-container',
        'on-error',
        'on-error-container',
        'surface',
        'surface-dim',
        'surface-bright',
        'surface-variant',
        'surface-tint',
        'surface-container',
        'surface-container-low',
        'surface-container-high',
        'surface-container-highest',
        'surface-container-lowest',
        'on-surface',
        'on-surface-variant',
        'outline',
        'outline-variant',
        'background',
        'on-background',
        'inverse-surface',
        'inverse-on-surface',
        'inverse-primary',
      ]),
      fontSize: {
        'headline-lg': [
          '32px',
          { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'headline-md': [
          '24px',
          { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '16px', fontWeight: '700' }],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      spacing: {
        unit: '8px',
        gutter: '24px',
        'margin-mobile': '16px',
        'margin-desktop': '40px',
      },
    },
  },
  plugins: [],
};
