// App
export const APP_NAME = 'MediHeal';
export const APP_SCHEME = 'mediheal';
export const APP_VERSION = '1.0.0';

// API
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com';

// Storage Keys
export const STORAGE_KEYS = {
  APP_STORE: 'app-store',
  LANGUAGE: 'app-language',
} as const;

// Storage
export const MMKV_ID = 'mediheal-storage';

// Sentry
export const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';
export const SENTRY_TRACES_SAMPLE_RATE_DEV = 1.0;
export const SENTRY_TRACES_SAMPLE_RATE_PROD = 0.2;

// Query
export const QUERY_STALE_TIME = 1000 * 60 * 5; // 5 minutes
export const QUERY_RETRY_COUNT = 2;

// i18n
export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
] as const;

// Layout
export const CONTAINER_MAX_WIDTH = 1200;
