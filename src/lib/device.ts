import { randomUUID } from 'expo-crypto';
import { getCalendars } from 'expo-localization';
import { mmkvStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

const FALLBACK_TZ = 'Asia/Kolkata';

/** Stable per-install device id, generated once and persisted (mirrors web's device_id). */
export function getDeviceId(): string {
  let id = mmkvStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!id) {
    id = randomUUID();
    mmkvStorage.setItem(STORAGE_KEYS.DEVICE_ID, id);
  }
  return id;
}

/** IANA timezone from the device, falling back to Asia/Kolkata like the web app. */
export function getTimezone(): string {
  return getCalendars()[0]?.timeZone ?? FALLBACK_TZ;
}
