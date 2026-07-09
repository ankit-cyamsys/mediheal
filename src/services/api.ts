import { API_BASE_URL } from '@/lib/constants';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiOptions {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  token?: string | null;
}

/** Error thrown for non-2xx responses, carrying the status and parsed body. */
export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Thin fetch wrapper mirroring the web frontend's `api()` helper:
 * builds the URL + query string, attaches a bearer token, JSON-encodes the body,
 * and throws an ApiError on failure.
 */
export async function api<T = unknown>(
  method: HttpMethod,
  path: string,
  { body, query, token }: ApiOptions = {},
): Promise<T> {
  const url = new URL(API_BASE_URL + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? safeParse(text) : null;

  if (!res.ok) {
    const detail = (data as { detail?: unknown })?.detail ?? data ?? res.statusText;
    const message = typeof detail === 'string' ? detail : JSON.stringify(detail);
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}
