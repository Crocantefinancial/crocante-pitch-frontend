import {
  getBackendTokenFromRequest,
  getSessionExpiresAtFromRequest,
} from "@/lib/auth/cookies";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/session — return session state for the client (expiresAt for expiry modal).
 * Call with credentials. Returns { hasSession, expiresAt } (expiresAt in ms since epoch).
 */
export async function GET(req: NextRequest) {
  const token = getBackendTokenFromRequest(req);
  const expiresAt = getSessionExpiresAtFromRequest(req);
  return NextResponse.json({
    hasSession: !!token,
    expiresAt: expiresAt ?? undefined,
  });
}
