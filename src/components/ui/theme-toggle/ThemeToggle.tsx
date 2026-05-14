import { View, Pressable, Text } from 'react-native';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { THEME_OPTIONS, type ThemeOption } from '@/lib/constants';

const ICONS: Record<ThemeOption, string> = {
  light: '☀️',
  dark: '🌙',
  system: '⚙️',
};

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useAppColorScheme();

  return (
    <View
      className={`flex-row items-center rounded-xl border border-outline-variant bg-surface-container p-1 dark:border-d-outline-variant dark:bg-d-surface-container ${className}`}
    >
      {THEME_OPTIONS.map((option) => (
        <Pressable
          key={option}
          onPress={() => setTheme(option)}
          className={`flex-1 items-center rounded-lg px-3 py-2 ${theme === option ? 'bg-primary-container dark:bg-d-primary-container' : ''}`}
        >
          <Text className={`text-[16px] ${theme === option ? '' : 'opacity-50'}`}>
            {ICONS[option]}
          </Text>
          <Text
            className={`mt-1 text-[10px] font-semibold uppercase ${theme === option ? 'text-on-primary-container dark:text-d-on-primary-container' : 'text-on-surface-variant dark:text-d-on-surface-variant'}`}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
