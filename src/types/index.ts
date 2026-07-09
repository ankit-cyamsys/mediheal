/** Backend localizes text as { en: "...", ... }; some fields may arrive as plain strings. */
export type Localized = { en?: string; [lang: string]: string | undefined };
export type LocalizedText = Localized | string | null | undefined;

export interface User {
  id: string;
  email?: string;
  name?: string;
  age?: number;
  gender?: string;
  timezone?: string;
}

export type ProgramKind = 'course' | 'collection' | 'single';

/** Session as returned inside a program detail response. */
export interface Session {
  id: string;
  day_number: number;
  title?: LocalizedText;
  description?: LocalizedText;
  durations?: number[];
  status?: 'locked' | 'unlocked' | 'completed';
}

/** Summary shape from GET /api/v1/programs. */
export interface ProgramSummary {
  id: string;
  slug?: string;
  kind: ProgramKind;
  title?: LocalizedText;
  description?: LocalizedText;
  total_sessions: number;
}

/** Full shape from GET /api/v1/programs/:id (includes sessions). */
export interface Program extends ProgramSummary {
  sessions: Session[];
}

export interface Progress {
  sessions_completed: string[];
  current_day: number;
  current_streak: number;
  longest_streak: number;
  total_minutes: number;
}

/** Auth token kind, mirrors the web app's token_kind. */
export type TokenKind = 'firebase' | 'guest';

/** POST /api/v1/auth/signin|signup response. */
export interface AuthResponse {
  id_token: string;
  user: User;
}

/** POST /api/v1/auth/guest response. */
export interface GuestResponse {
  access_token: string;
  user: User;
}

/** GET /api/v1/sessions/:id/play response. */
export interface PlaybackInfo {
  url: string;
  duration: number;
}
