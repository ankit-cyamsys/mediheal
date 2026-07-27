import { useColorScheme } from 'react-native';
import { useThemeStore, type ThemeMode } from '@/stores/theme-store';
import { schemes, cssVars, type ColorScheme, type ColorToken } from '@/lib/theme';

export interface Theme {
  /** User preference: 'light' | 'dark' | 'system'. */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** Resolved scheme after applying 'system'. */
  scheme: ColorScheme;
  /** Active palette (hex), for TS consumers like SVG/icon tints. */
  colors: Record<ColorToken, string>;
  /** `--color-*` channel map for the active scheme (feed to NativeWind `vars()`). */
  vars: Record<string, string>;
}

/** Resolves the active color scheme from the stored preference + OS setting. */
export function useTheme(): Theme {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const system = useColorScheme();

  const scheme: ColorScheme = mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;

  return {
    mode,
    setMode,
    scheme,
    colors: schemes[scheme],
    vars: cssVars[scheme],
  };
}

/** Convenience hook when a component only needs the active palette. */
export function useThemeColors(): Record<ColorToken, string> {
  return useTheme().colors;
}
