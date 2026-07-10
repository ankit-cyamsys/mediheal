import '../../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Providers } from '@/components/providers';
import { initSentry } from '@/lib/sentry';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
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
          <Stack.Screen name="donate" options={{ presentation: 'modal' }} />
        </Stack.Protected>
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Providers>
      <StatusBar style="auto" />
      <RootNavigator />
    </Providers>
  );
}
