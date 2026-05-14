import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { colors, darkColors } from '@/lib/theme';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? darkColors['surface-container'] : colors['surface-container'],
        },
        headerTintColor: isDark ? darkColors['on-surface'] : colors['on-surface'],
        tabBarStyle: {
          backgroundColor: isDark ? darkColors['surface-container'] : colors['surface-container'],
          borderTopColor: isDark ? darkColors['outline-variant'] : colors['outline-variant'],
        },
        tabBarActiveTintColor: isDark ? darkColors.primary : colors['primary-container'],
        tabBarInactiveTintColor: isDark
          ? darkColors['on-surface-variant']
          : colors['on-surface-variant'],
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
