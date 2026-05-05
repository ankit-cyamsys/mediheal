import { Platform } from 'react-native';
import {
  SENTRY_DSN,
  SENTRY_TRACES_SAMPLE_RATE_DEV,
  SENTRY_TRACES_SAMPLE_RATE_PROD,
} from '@/lib/constants';

export function initSentry() {
  if (Platform.OS === 'web') return;

  const Sentry = require('@sentry/react-native');
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: __DEV__ ? SENTRY_TRACES_SAMPLE_RATE_DEV : SENTRY_TRACES_SAMPLE_RATE_PROD,
    enabled: !__DEV__,
  });
}
