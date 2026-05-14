import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { colorScheme } from 'nativewind';
import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const deviceScheme = useDeviceColorScheme();

  useEffect(() => {
    const resolved = theme === 'system' ? (deviceScheme ?? 'light') : theme;
    colorScheme.set(resolved);
  }, [theme, deviceScheme]);

  return <>{children}</>;
}
