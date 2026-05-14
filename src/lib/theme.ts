export const colors = {
  primary: '#052920',
  'primary-container': '#1E3F35',
  'primary-fixed': '#C6EBDC',
  'primary-fixed-dim': '#AACEC0',
  'on-primary': '#FFFFFF',
  'on-primary-container': '#87AA9D',
  'on-primary-fixed': '#002018',
  'on-primary-fixed-variant': '#2C4D42',

  secondary: '#8A496A',
  'secondary-container': '#FFAFD4',
  'secondary-fixed': '#FFD8E8',
  'secondary-fixed-dim': '#FFAFD4',
  'on-secondary': '#FFFFFF',
  'on-secondary-container': '#7C3E5E',
  'on-secondary-fixed': '#390525',
  'on-secondary-fixed-variant': '#6E3252',

  tertiary: '#242420',
  'tertiary-container': '#3A3935',
  'tertiary-fixed': '#E5E2DB',
  'tertiary-fixed-dim': '#C9C6C0',
  'on-tertiary': '#FFFFFF',
  'on-tertiary-container': '#A4A39C',
  'on-tertiary-fixed': '#1C1C18',
  'on-tertiary-fixed-variant': '#474742',

  error: '#BA1A1A',
  'error-container': '#FFDAD6',
  'on-error': '#FFFFFF',
  'on-error-container': '#93000A',

  surface: '#F8FAF5',
  'surface-dim': '#D9DBD6',
  'surface-bright': '#F8FAF5',
  'surface-variant': '#E1E3DF',
  'surface-tint': '#44655A',
  'surface-container': '#EDEEEA',
  'surface-container-low': '#F2F4F0',
  'surface-container-high': '#E7E9E4',
  'surface-container-highest': '#E1E3DF',
  'surface-container-lowest': '#FFFFFF',
  'on-surface': '#191C1A',
  'on-surface-variant': '#414845',

  outline: '#717975',
  'outline-variant': '#C1C8C4',

  background: '#F8FAF5',
  'on-background': '#191C1A',
  'inverse-surface': '#2E312E',
  'inverse-on-surface': '#F0F1ED',
  'inverse-primary': '#AACEC0',
} as const;

export const typography = {
  headlineLg: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.32,
  },
  headlineMd: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: -0.24,
  },
  headlineSm: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  bodyLg: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  bodyMd: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  labelMd: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.14,
  },
  labelSm: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700' as const,
  },
} as const;

export const spacing = {
  unit: 8,
  gutter: 24,
  marginMobile: 16,
  marginDesktop: 40,
  containerMax: 1200,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export type ColorToken = keyof typeof colors;
export type TypographyToken = keyof typeof typography;

export const darkColors = {
  primary: '#AACEC0',
  'primary-container': '#1E3F35',
  'primary-fixed': '#C6EBDC',
  'primary-fixed-dim': '#AACEC0',
  'on-primary': '#15362C',
  'on-primary-container': '#87AA9D',
  'on-primary-fixed': '#002018',
  'on-primary-fixed-variant': '#2C4D42',

  secondary: '#EBB5ED',
  'secondary-container': '#643968',
  'secondary-fixed': '#FFD6FE',
  'secondary-fixed-dim': '#EBB5ED',
  'on-secondary': '#49204E',
  'on-secondary-container': '#DCA7DE',
  'on-secondary-fixed': '#310937',
  'on-secondary-fixed-variant': '#613766',

  tertiary: '#B8CAC9',
  'tertiary-container': '#2C3C3C',
  'tertiary-fixed': '#D4E6E5',
  'tertiary-fixed-dim': '#B8CAC9',
  'on-tertiary': '#233333',
  'on-tertiary-container': '#95A6A5',
  'on-tertiary-fixed': '#0E1E1E',
  'on-tertiary-fixed-variant': '#3A4A49',

  error: '#FFB4AB',
  'error-container': '#93000A',
  'on-error': '#690005',
  'on-error-container': '#FFDAD6',

  surface: '#121413',
  'surface-dim': '#121413',
  'surface-bright': '#383A38',
  'surface-variant': '#333534',
  'surface-tint': '#AACEC0',
  'surface-container': '#1E201F',
  'surface-container-low': '#1A1C1B',
  'surface-container-high': '#282A29',
  'surface-container-highest': '#333534',
  'surface-container-lowest': '#0D0F0E',
  'on-surface': '#E2E3E0',
  'on-surface-variant': '#C1C8C4',

  outline: '#8B928E',
  'outline-variant': '#414845',

  background: '#121413',
  'on-background': '#E2E3E0',
  'inverse-surface': '#E2E3E0',
  'inverse-on-surface': '#2F312F',
  'inverse-primary': '#44655A',
} as const;

export type DarkColorToken = keyof typeof darkColors;
