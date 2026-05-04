import { Platform } from 'react-native';

export function initSentry() {
  if (Platform.OS === 'web') return;

  const Sentry = require('@sentry/react-native');
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    enabled: !__DEV__,
  });
}
