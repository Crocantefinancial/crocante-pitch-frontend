import envParsed from "@/config/envParsed";
import { getBackendTokenFromRequest } from "@/lib/auth/cookies";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ path: string[] }> | { path: string[] } };

function buildUpstreamUrl(req: NextRequest, base: string, pathParts: string[]) {
  const url = new URL(req.url);
  const upstream = new URL(`${base.replace(/\/$/, "")}/${pathParts.join("/")}`);
  upstream.search = url.search;
  return upstream.toString();
}

/** Require valid BFF session for these path prefixes (token injected by BFF). */
function requiresAuth(pathParts: string[]) {
  const first = pathParts[0] ?? "";
  return first === "private";
}

function forwardHeaders(
  req: NextRequest,
  proxyOrigin: string,
  backendToken: string | null
) {
  const h = new Headers(req.headers);

  h.delete("host");
  h.delete("connection");
  h.delete("content-length");
  h.delete("accept-encoding");
  h.delete("cookie");
  h.delete("authorization"); // Never forward client auth; BFF injects token

  if (backendToken) {
    h.set("Authorization", `Bearer ${backendToken}`);
  }

  if (proxyOrigin) {
    h.set("origin", proxyOrigin);
    h.set("referer", `${proxyOrigin.replace(/\/$/, "")}/`);
  }

  return h;
}

function sanitizeResponseHeaders(headers: Headers) {
  const out = new Headers(headers);

  out.delete("transfer-encoding");
  out.delete("content-encoding");
  out.delete("connection");

  out.delete("access-control-allow-origin");
  out.delete("access-control-allow-credentials");
  out.delete("access-control-allow-headers");
  out.delete("access-control-allow-methods");

  return out;
}

function isAllowedPath(pathParts: string[]) {
  const first = pathParts[0] ?? "";
  return first === "auth" || first === "private";
}

async function handler(req: NextRequest, ctx: Ctx) {
  const env = envParsed();
  // gate FIRST, before touching required env vars
  const appEnv = env.APP_ENV ?? "development";
  if (appEnv !== "development") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const apiGateway = env.API_GATEWAY;
  if (!apiGateway) {
    return NextResponse.json(
      { proxyError: true, message: "Missing API_GATEWAY env var" },
      { status: 500 }
    );
  }

  const proxyOrigin = env.API_PROXY_ORIGIN ?? "";

  try {
    const resolved = await ctx.params;
    // Ensure path is always string[] (Next may pass string in some cases)
    const rawPath = resolved.path;
    const pathSegments: string[] = Array.isArray(rawPath)
      ? rawPath
      : typeof rawPath === "string"
        ? (rawPath as string).split("/").filter(Boolean)
        : [];

    if (!isAllowedPath(pathSegments)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    let backendToken: string | null = null;
    if (requiresAuth(pathSegments)) {
      backendToken = getBackendTokenFromRequest(req);
      if (!backendToken) {
        return new NextResponse(
          JSON.stringify({ error: "Unauthorized", code: "SESSION_INVALID" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const targetUrl = buildUpstreamUrl(req, apiGateway, pathSegments);
    const method = req.method.toUpperCase();
    const headers = forwardHeaders(req, proxyOrigin, backendToken);

    const body =
      method === "GET" || method === "HEAD"
        ? undefined
        : await req.arrayBuffer();

    const upstreamRes = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: "manual",
    });

    const resHeaders = sanitizeResponseHeaders(upstreamRes.headers);
    if (backendToken && appEnv === "development") {
      resHeaders.set("X-BFF-Auth", "Bearer-sent");
    }
    const bytes = await upstreamRes.arrayBuffer();

    return new NextResponse(bytes, {
      status: upstreamRes.status,
      headers: resHeaders,
    });
  } catch (e: any) {
    return NextResponse.json(
      { proxyError: true, message: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
