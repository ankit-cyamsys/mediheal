import '../../global.css';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Providers } from '@/components/providers';
import { initSentry } from '@/lib/sentry';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { api, ApiError } from '@/services/api';
import type { User } from '@/types';

initSentry();

/** Redirects between the auth flow and the app based on token + onboarding state. */
function useAuthGate() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const onboarded = useAppStore((s) => s.onboarded);
  const segments = useSegments();
  const router = useRouter();

  // Hydrate /me on first authed launch (mirrors web ProtectedRoute).
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

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const onOnboarding = segments[0] === 'onboarding';

    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      router.replace(onboarded ? '/(tabs)' : '/onboarding');
    } else if (token && !onboarded && !onOnboarding && !inAuthGroup) {
      router.replace('/onboarding');
    }
  }, [token, onboarded, segments, router]);
}

function RootNavigator() {
  useAuthGate();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="programs/[id]" />
      <Stack.Screen name="play/[sessionId]" options={{ animation: 'fade' }} />
      <Stack.Screen name="complete" />
      <Stack.Screen name="donate" options={{ presentation: 'modal' }} />
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
