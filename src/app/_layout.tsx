import '../../global.css';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Providers } from '@/components/providers';
import { initSentry } from '@/lib/sentry';

initSentry();

export default function RootLayout() {
  return (
    <View className="flex-1">
      <Providers>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="dev" />
        </Stack>
      </Providers>
    </View>
  );
}
