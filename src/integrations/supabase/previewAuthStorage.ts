/**
 * Supabase auth session storage.
 *
 * Auth sessions are stored in the browser's localStorage.
 */
export function brokeredPreviewStorage(): Storage | undefined {
  if (typeof window === 'undefined') return undefined;
  return localStorage;
}
