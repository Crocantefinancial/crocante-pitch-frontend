import envParsed from "@/config/envParsed";
import {
  clearSessionCookie,
  getBackendTokenFromRequest,
} from "@/lib/auth/cookies";
import { NextRequest, NextResponse } from "next/server";

function getBackendAuthUrl(gateway: string, path: string): string {
  const base = gateway.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true }, { status: 200 });
  clearSessionCookie(response);

  const backendToken = getBackendTokenFromRequest(req);
  if (backendToken) {
    try {
      const env = envParsed();
      const logoutUrl = getBackendAuthUrl(env.API_GATEWAY, env.EP_AUTH_LOGOUT);
      await fetch(logoutUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${backendToken}`,
        },
      });
    } catch (e) {
      console.error("[BFF logout] backend call failed", e);
    }
  }

  return response;
}
