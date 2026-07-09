import type { LocalizedText } from '@/types';

/** Resolve a localized field to a display string (backend sends { en: "..." } or a plain string). */
export function localized(value: LocalizedText): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.en ?? '';
}
