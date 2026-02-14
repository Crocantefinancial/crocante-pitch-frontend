import envParsed from "@/config/envParsed";
import { NextRequest, NextResponse } from "next/server";
import { decryptToken, encryptToken } from "./encrypted-session";
import {
  SESSION_COOKIE_NAME,
  getSessionCookieMaxAge,
} from "./session-store";

const isProd = envParsed().APP_ENV === "production";

export type SessionPayload = { token: string; issuedAt: number };

function getCookieValue(req: NextRequest): string | undefined {
  const fromCookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (fromCookies) return fromCookies;
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]*)`)
  );
  return match?.[1]?.trim() ?? undefined;
}

function parseSessionPayload(decrypted: string): SessionPayload | null {
  try {
    const o = JSON.parse(decrypted) as unknown;
    if (o && typeof o === "object" && typeof (o as SessionPayload).token === "string") {
      const issuedAt = typeof (o as SessionPayload).issuedAt === "number"
        ? (o as SessionPayload).issuedAt
        : Date.now();
      return { token: (o as SessionPayload).token, issuedAt };
    }
  } catch {
    // legacy: cookie was plain token
  }
  return { token: decrypted, issuedAt: Date.now() };
}

/**
 * Get session payload from request cookie (decrypted). Used for token and expiry.
 */
export function getSessionPayloadFromRequest(req: NextRequest): SessionPayload | null {
  const value = getCookieValue(req);
  if (!value) return null;
  const decrypted = decryptToken(value);
  if (!decrypted) return null;
  return parseSessionPayload(decrypted);
}

/**
 * Get the backend token from the request cookie (decrypted).
 */
export function getBackendTokenFromRequest(req: NextRequest): string | null {
  return getSessionPayloadFromRequest(req)?.token ?? null;
}

/**
 * Session expiry time in ms (UTC). Null if no valid session.
 */
export function getSessionExpiresAtFromRequest(req: NextRequest): number | null {
  const payload = getSessionPayloadFromRequest(req);
  if (!payload) return null;
  return payload.issuedAt + getSessionCookieMaxAge() * 1000;
}

/**
 * Set the session cookie with the backend token (stored encrypted with issuedAt).
 */
export function setSessionCookie(
  res: NextResponse,
  backendToken: string,
  issuedAt: number = Date.now()
): NextResponse {
  const maxAge = getSessionCookieMaxAge();
  const encrypted = encryptToken(JSON.stringify({ token: backendToken, issuedAt }));
  res.cookies.set(SESSION_COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge,
  });
  return res;
}

export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}
