import { ApiError } from '@/services/api';

/** Shape of a single FastAPI/pydantic validation error item. */
interface ValidationItem {
  loc?: (string | number)[];
  msg?: string;
  type?: string;
}

type ErrorContext = 'signin' | 'signup' | 'guest' | 'social' | 'profile';

const FIELD_LABELS: Record<string, string> = {
  email: 'Email',
  password: 'Password',
  name: 'Name',
  timezone: 'Timezone',
  age: 'Age',
};

function fieldLabel(loc?: (string | number)[]): string | null {
  if (!loc?.length) return null;
  // Drop the leading "body"/"query" segment; take the last string key.
  const key = [...loc]
    .reverse()
    .find((p) => typeof p === 'string' && p !== 'body' && p !== 'query');
  return key ? (FIELD_LABELS[String(key)] ?? String(key)) : null;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Turns a raw pydantic message into something a person should read. */
function friendlyValidationMessage(item: ValidationItem): string {
  const label = fieldLabel(item.loc);
  const raw = (item.msg ?? '').trim();

  if (/valid email address/i.test(raw)) return 'Please enter a valid email address.';

  const minLen = raw.match(/at least (\d+) characters?/i);
  if (minLen) return `${label ?? 'This field'} must be at least ${minLen[1]} characters.`;

  if (/field required/i.test(raw)) return `${label ?? 'This field'} is required.`;

  // Generic fallback: prefix with the field name and drop pydantic's "Value error, ".
  const cleaned = raw.replace(/^value error,?\s*/i, '').replace(/^value\s+/i, '');
  const sentence = capitalize(cleaned || 'is invalid');
  return label ? `${label}: ${sentence}` : sentence;
}

/**
 * Converts any thrown error (usually an ApiError) into a short, user-facing
 * message. Handles FastAPI's `{ detail: [...] }` validation payloads, string
 * `detail`s, HTTP status fallbacks, and network failures.
 */
export function humanizeError(err: unknown, context?: ErrorContext): string {
  if (err instanceof ApiError) {
    const detail = (err.body as { detail?: unknown } | null | undefined)?.detail;

    if (Array.isArray(detail) && detail.length) {
      return friendlyValidationMessage(detail[0] as ValidationItem);
    }
    if (typeof detail === 'string' && detail.trim()) {
      return detail.trim();
    }

    switch (err.status) {
      case 400:
      case 401:
        return context === 'signin'
          ? 'Incorrect email or password.'
          : 'Please check your details and try again.';
      case 403:
        return 'You don’t have permission to do that.';
      case 404:
        return 'We couldn’t find what you were looking for.';
      case 409:
        return context === 'signup'
          ? 'An account with this email already exists. Try signing in instead.'
          : 'That conflicts with something that already exists.';
      case 422:
        return 'Please check the highlighted fields and try again.';
      case 429:
        return 'Too many attempts. Please wait a moment and try again.';
      default:
        if (err.status >= 500) return 'Something went wrong on our end. Please try again shortly.';
        return err.message || 'Something went wrong. Please try again.';
    }
  }

  if (err instanceof Error) {
    if (/network request failed|failed to fetch/i.test(err.message)) {
      return 'No internet connection. Please check your network and try again.';
    }
    return err.message;
  }

  return 'Something went wrong. Please try again.';
}
