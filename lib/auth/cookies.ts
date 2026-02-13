import envParsed from "@/config/envParsed";
import { NextRequest, NextResponse } from "next/server";
import { decryptToken, encryptToken } from "./encrypted-session";
import {
  SESSION_COOKIE_NAME,
  getSessionCookieMaxAge,
} from "./session-store";

const isProd = envParsed().APP_ENV === "production";

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

/**
 * Get the backend token from the request cookie (decrypted).
 * Cookie stores encrypted token so no server-side session store is needed.
 */
export function getBackendTokenFromRequest(req: NextRequest): string | null {
  const value = getCookieValue(req);
  if (!value) return null;
  return decryptToken(value);
}

/**
 * Set the session cookie with the backend token (stored encrypted).
 */
export function setSessionCookie(
  res: NextResponse,
  backendToken: string
): NextResponse {
  const maxAge = getSessionCookieMaxAge();
  const encrypted = encryptToken(backendToken);
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
