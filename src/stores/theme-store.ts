import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';
import { STORAGE_KEYS, DEFAULT_THEME, type ThemeOption } from '@/lib/constants';

interface ThemeState {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
