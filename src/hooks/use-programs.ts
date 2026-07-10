import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth-store';
import type { Program, ProgramSummary, Progress, PlaybackInfo } from '@/types';

/** GET /api/v1/programs — public list of programs. */
export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: () => api<ProgramSummary[]>('GET', '/api/v1/programs'),
  });
}

/** GET /api/v1/programs/:id — full program with sessions (auth-aware for status). */
export function useProgram(id: string | undefined) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['program', id],
    enabled: !!id,
    queryFn: () => api<Program>('GET', `/api/v1/programs/${id}`, { token }),
  });
}

/** GET /api/v1/progress/:programId — user progress for a program. */
export function useProgress(programId: string | undefined) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['progress', programId],
    enabled: !!programId,
    queryFn: () => api<Progress>('GET', `/api/v1/progress/${programId}`, { token }),
  });
}

export interface CompletePayload {
  session_id: string;
  duration_played: number;
  completion_percentage: number;
}

/** POST /api/v1/progress/complete — record a finished/partial session. */
export function useCompleteSession() {
  const token = useAuthStore((s) => s.token);
  return useMutation({
    mutationFn: (body: CompletePayload) =>
      api('POST', '/api/v1/progress/complete', { token, body }),
  });
}

/** GET /api/v1/sessions/:id/play — signed playback URL + duration. */
export function fetchPlayback(sessionId: string, token: string | null, duration?: string) {
  return api<PlaybackInfo>('GET', `/api/v1/sessions/${sessionId}/play`, {
    token,
    query: { duration: duration || undefined },
  });
}
