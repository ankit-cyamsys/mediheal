import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

interface AppState {
  onboarded: boolean;
  mood: string | null;
  setOnboarded: (value: boolean) => void;
  setMood: (value: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboarded: false,
      mood: null,
      setOnboarded: (value) => set({ onboarded: value }),
      setMood: (value) => set({ mood: value }),
    }),
    {
      name: STORAGE_KEYS.APP_STORE,
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
