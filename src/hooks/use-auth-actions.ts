import { useCallback } from 'react';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth-store';
import { getDeviceId, getTimezone } from '@/lib/device';
import type { AuthResponse, GuestResponse, User } from '@/types';

export interface SignUpInput {
  email: string;
  password: string;
  name?: string;
  age?: number;
  gender?: string;
}

/** Auth actions that hit the backend and populate the auth store (mirrors web Login). */
export function useAuthActions() {
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const base = () => ({ device_id: getDeviceId(), timezone: getTimezone() });

  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = await api<AuthResponse>('POST', '/api/v1/auth/signin', {
        body: { email, password, ...base() },
      });
      setToken(res.id_token, 'firebase');
      setUser(res.user);
    },
    [setToken, setUser],
  );

  const signUp = useCallback(
    async (input: SignUpInput) => {
      const res = await api<AuthResponse>('POST', '/api/v1/auth/signup', {
        body: { ...input, ...base() },
      });
      setToken(res.id_token, 'firebase');
      setUser(res.user);
    },
    [setToken, setUser],
  );

  const continueAsGuest = useCallback(async () => {
    const res = await api<GuestResponse>('POST', '/api/v1/auth/guest', {
      body: { ...base() },
    });
    setToken(res.access_token, 'guest');
    setUser(res.user);
  }, [setToken, setUser]);

  /** Exchange a Firebase ID token for a session (used by native social sign-in later). */
  const loginSocial = useCallback(
    async (idToken: string) => {
      const user = await api<User>('POST', '/api/v1/auth/login_social', {
        body: { ...base() },
        token: idToken,
      });
      setToken(idToken, 'firebase');
      setUser(user);
    },
    [setToken, setUser],
  );

  return { signIn, signUp, continueAsGuest, loginSocial };
}
