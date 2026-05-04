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
