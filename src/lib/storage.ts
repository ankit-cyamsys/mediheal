import { Platform } from 'react-native';
import { MMKV_ID } from '@/lib/constants';

const memoryStore: Record<string, string> = {};

function createStorage() {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: (key: string) => localStorage.removeItem(key),
    };
  }

  try {
    const { MMKV } = require('react-native-mmkv');
    const instance = new MMKV({ id: MMKV_ID });
    return {
      getItem: (key: string) => instance.getString(key) ?? null,
      setItem: (key: string, value: string) => instance.set(key, value),
      removeItem: (key: string) => instance.delete(key),
    };
  } catch {
    // Fallback for Expo Go where MMKV native module isn't available
    return {
      getItem: (key: string) => memoryStore[key] ?? null,
      setItem: (key: string, value: string) => {
        memoryStore[key] = value;
      },
      removeItem: (key: string) => {
        delete memoryStore[key];
      },
    };
  }
}

export const mmkvStorage = createStorage();
