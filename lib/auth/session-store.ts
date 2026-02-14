/**
 * Server-side session store for BFF.
 * In-memory for single-instance; replace with Redis for production/multi-instance.
 */

export const SESSION_COOKIE_NAME = "crocante_session";
const SESSION_MAX_AGE_SEC = 60 * 5; // 5 minutes

export type Session = {
  backendToken: string;
  createdAt: number;
};

const store = new Map<string, Session>();

function isExpired(s: Session, maxAgeSec: number = SESSION_MAX_AGE_SEC): boolean {
  return Date.now() - s.createdAt > maxAgeSec * 1000;
}

export function createSession(backendToken: string): { sessionId: string; maxAge: number } {
  const sessionId = crypto.randomUUID();
  store.set(sessionId, {
    backendToken,
    createdAt: Date.now(),
  });
  return { sessionId, maxAge: SESSION_MAX_AGE_SEC };
}

export function getSession(sessionId: string): Session | null {
  const s = store.get(sessionId);
  if (!s || isExpired(s)) {
    if (s) store.delete(sessionId);
    return null;
  }
  return s;
}

export function deleteSession(sessionId: string): void {
  store.delete(sessionId);
}

export function getSessionCookieMaxAge(): number {
  return SESSION_MAX_AGE_SEC;
}
