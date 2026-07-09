import { useCallback } from 'react';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth-store';

/** Sign out: best-effort server logout, then clear the auth store (gate redirects to login). */
export function useSignOut() {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  return useCallback(async () => {
    try {
      await api('POST', '/api/v1/auth/logout', { token });
    } catch {
      // still log out client-side
    }
    logout();
  }, [token, logout]);
}
