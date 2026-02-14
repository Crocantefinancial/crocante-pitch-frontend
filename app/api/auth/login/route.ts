import envParsed from "@/config/envParsed";
import { setSessionCookie } from "@/lib/auth/cookies";
import { LoginRequestSchema } from "@/services/api/auth/schemas";
import { NextRequest, NextResponse } from "next/server";

function getBackendAuthUrl(gateway: string, path: string): string {
  const base = gateway.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const env = envParsed();
    const loginUrl = getBackendAuthUrl(env.API_GATEWAY, env.EP_AUTH_LOGIN);
    const res = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await res.json().catch(() => ({}));
    const token =
      data?.data?.token ??
      data?.access_token ??
      data?.token ??
      (typeof data?.data?.access_token === "string" ? data.data.access_token : undefined);

    if (!res.ok || !token || typeof token !== "string") {
      const status = res.ok ? 401 : res.status;
      return NextResponse.json(
        { error: data?.error ?? "Login failed" },
        { status }
      );
    }

    const response = NextResponse.json({ success: true }, { status: 200 });
    setSessionCookie(response, token);
    return response;
  } catch (e) {
    console.error("[BFF login]", e);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
