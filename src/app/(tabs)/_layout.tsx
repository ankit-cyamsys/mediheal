import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { colors, darkColors } from '@/lib/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const activeColor = isDark ? darkColors.primary : colors['primary-container'];
  const inactiveColor = isDark ? darkColors['on-surface-variant'] : colors['on-surface-variant'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark
            ? darkColors['surface-container']
            : colors['surface-container-lowest'],
          borderTopColor: isDark ? darkColors['outline-variant'] : colors['outline-variant'],
          paddingBottom: 24,
          paddingTop: 8,
          height: 72,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <MaterialIcons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <MaterialIcons name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <MaterialIcons name="show-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <MaterialIcons name="auto-stories" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Donate',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="volunteer-activism" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
