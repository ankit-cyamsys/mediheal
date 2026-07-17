import { Tabs } from 'expo-router';
import { colors } from '@/lib/theme';
import { Icon, type IconName } from '@/components/icon';

const TAB_ICONS: Record<string, IconName> = {
  index: 'home',
  explore: 'compass',
  donate: 'heart',
  progress: 'chart',
  profile: 'user',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.outline,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors['outline-variant'],
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, focused }) => (
          <Icon
            name={TAB_ICONS[route.name] ?? 'home'}
            size={23}
            stroke={focused ? 2.4 : 2}
            color={color}
          />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="donate" options={{ title: 'Donate' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
