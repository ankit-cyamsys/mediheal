import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import type { TokenKind, User } from '@/types';

interface AuthState {
  token: string | null;
  tokenKind: TokenKind | null;
  user: User | null;
  /** Set the bearer token and how it was obtained; pass null to clear. */
  setToken: (token: string | null, kind: TokenKind | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      tokenKind: null,
      user: null,
      setToken: (token, tokenKind) => set({ token, tokenKind }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, tokenKind: null, user: null }),
    }),
    {
      name: STORAGE_KEYS.AUTH_STORE,
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
