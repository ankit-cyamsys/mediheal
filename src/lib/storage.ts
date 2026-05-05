import { Platform } from 'react-native';
import { MMKV_ID } from '@/lib/constants';

function createStorage() {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: (key: string) => localStorage.removeItem(key),
    };
  }

  const { MMKV } = require('react-native-mmkv');
  const instance = new MMKV({ id: MMKV_ID });
  return {
    getItem: (key: string) => instance.getString(key) ?? null,
    setItem: (key: string, value: string) => instance.set(key, value),
    removeItem: (key: string) => instance.delete(key),
  };
}

export const mmkvStorage = createStorage();
