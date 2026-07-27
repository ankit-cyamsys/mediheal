/** Material-3 light scheme (the app's original palette). */
export const lightColors = {
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

/**
 * Material-3 dark scheme for the same brand. "Fixed" roles are intentionally
 * identical to the light scheme (that's what "fixed" means in M3); the tonal
 * roles flip so light-on-dark contrast holds up.
 */
export const darkColors: Record<ColorToken, string> = {
  primary: '#AACEC0',
  'primary-container': '#2C4D42',
  'primary-fixed': '#C6EBDC',
  'primary-fixed-dim': '#AACEC0',
  'on-primary': '#06372B',
  'on-primary-container': '#C6EBDC',
  'on-primary-fixed': '#002018',
  'on-primary-fixed-variant': '#2C4D42',

  secondary: '#FFAFD4',
  'secondary-container': '#6E3252',
  'secondary-fixed': '#FFD8E8',
  'secondary-fixed-dim': '#FFAFD4',
  'on-secondary': '#570525',
  'on-secondary-container': '#FFD8E8',
  'on-secondary-fixed': '#390525',
  'on-secondary-fixed-variant': '#6E3252',

  tertiary: '#C9C6C0',
  'tertiary-container': '#474742',
  'tertiary-fixed': '#E5E2DB',
  'tertiary-fixed-dim': '#C9C6C0',
  'on-tertiary': '#2D2D28',
  'on-tertiary-container': '#E5E2DB',
  'on-tertiary-fixed': '#1C1C18',
  'on-tertiary-fixed-variant': '#474742',

  error: '#FFB4AB',
  'error-container': '#93000A',
  'on-error': '#690005',
  'on-error-container': '#FFDAD6',

  surface: '#101410',
  'surface-dim': '#101410',
  'surface-bright': '#363A36',
  'surface-variant': '#414845',
  'surface-tint': '#AACEC0',
  'surface-container': '#1D211E',
  'surface-container-low': '#191C1A',
  'surface-container-high': '#282B28',
  'surface-container-highest': '#323633',
  'surface-container-lowest': '#0B0F0D',
  'on-surface': '#E0E3DE',
  'on-surface-variant': '#C1C8C4',

  outline: '#8B938F',
  'outline-variant': '#414845',

  background: '#101410',
  'on-background': '#E0E3DE',
  'inverse-surface': '#E0E3DE',
  'inverse-on-surface': '#2E312E',
  'inverse-primary': '#052920',
};

/** Default export kept for non-reactive/module-scope consumers (light scheme). */
export const colors = lightColors;

export type ColorScheme = 'light' | 'dark';

export const schemes: Record<ColorScheme, Record<ColorToken, string>> = {
  light: lightColors,
  dark: darkColors,
};

function hexToChannels(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/** Converts a palette into the `--color-*` custom properties NativeWind reads. */
export function toCssVars(palette: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [token, hex] of Object.entries(palette)) {
    out[`--color-${token}`] = hexToChannels(hex);
  }
  return out;
}

export const cssVars: Record<ColorScheme, Record<string, string>> = {
  light: toCssVars(lightColors),
  dark: toCssVars(darkColors),
};

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
