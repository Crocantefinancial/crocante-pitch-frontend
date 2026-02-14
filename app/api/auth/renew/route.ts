import {
  getSessionPayloadFromRequest,
  setSessionCookie,
} from "@/lib/auth/cookies";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/renew — refresh the session cookie (new issuedAt, same token).
 * Call with credentials. Resets the expiry window so the user stays signed in.
 */
export async function POST(req: NextRequest) {
  const payload = getSessionPayloadFromRequest(req);
  if (!payload?.token) {
    return NextResponse.json(
      { error: "Unauthorized", code: "SESSION_INVALID" },
      { status: 401 }
    );
  }
  const response = NextResponse.json({ success: true }, { status: 200 });
  setSessionCookie(response, payload.token, Date.now());
  return response;
}
