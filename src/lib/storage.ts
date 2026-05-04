import { Platform } from 'react-native';

function createStorage() {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: (key: string) => localStorage.removeItem(key),
    };
  }

  const { MMKV } = require('react-native-mmkv');
  const instance = new MMKV({ id: 'mediheal-storage' });
  return {
    getItem: (key: string) => instance.getString(key) ?? null,
    setItem: (key: string, value: string) => instance.set(key, value),
    removeItem: (key: string) => instance.delete(key),
  };
}

export const mmkvStorage = createStorage();
