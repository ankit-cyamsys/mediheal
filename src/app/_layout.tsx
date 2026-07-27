import '../../global.css';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { vars } from 'nativewind';
import { Providers } from '@/components/providers';
import { initSentry } from '@/lib/sentry';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { useTheme } from '@/hooks/use-theme';
import { api, ApiError } from '@/services/api';
import type { User } from '@/types';

initSentry();

/** Hydrates /me on first authed launch (mirrors web ProtectedRoute). */
function useHydrateUser() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!token || user) return;
    let active = true;
    api<User>('GET', '/api/v1/auth/me', { token })
      .then((u) => active && setUser(u))
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401 && active) logout();
      });
    return () => {
      active = false;
    };
  }, [token, user, setUser, logout]);
}

function RootNavigator() {
  useHydrateUser();
  const token = useAuthStore((s) => s.token);
  const onboarded = useAppStore((s) => s.onboarded);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!token}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={!!token}>
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>

        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="programs/[id]" />
          <Stack.Screen name="play/[sessionId]" options={{ animation: 'fade' }} />
          <Stack.Screen name="complete" />
        </Stack.Protected>
      </Stack.Protected>
    </Stack>
  );
}

function ThemedApp() {
  const { scheme, colors, vars: themeVars } = useTheme();

  // Keep the native window background in sync so overscroll / transitions don't
  // flash the wrong color.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.surface).catch(() => {});
  }, [colors.surface]);

  return (
    <View style={vars(themeVars)} className="flex-1 bg-surface">
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </View>
  );
}

export default function RootLayout() {
  return (
    <Providers>
      <ThemedApp />
    </Providers>
  );
}
