import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useThemeStore } from '@/stores/theme-store';

export function useAppColorScheme() {
  const { theme, setTheme } = useThemeStore();
  const deviceScheme = useDeviceColorScheme();

  const resolvedScheme = theme === 'system' ? (deviceScheme ?? 'light') : theme;
  const isDark = resolvedScheme === 'dark';

  return { theme, resolvedScheme, isDark, setTheme };
}
