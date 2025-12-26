import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ path: string[] }> | { path: string[] } };

function buildUpstreamUrl(req: NextRequest, base: string, pathParts: string[]) {
  const url = new URL(req.url);
  const upstream = new URL(`${base.replace(/\/$/, "")}/${pathParts.join("/")}`);
  upstream.search = url.search;
  return upstream.toString();
}

function forwardHeaders(req: NextRequest, proxyOrigin: string) {
  const h = new Headers(req.headers);

  h.delete("host");
  h.delete("connection");
  h.delete("content-length");
  h.delete("accept-encoding");
  h.delete("cookie");

  // Optional origin spoof, controlled by env
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
  // gate FIRST, before touching required env vars
  const appEnv =
    process.env.APP_ENV ?? process.env.NEXT_PUBLIC_APP_ENV ?? "development";
  if (appEnv !== "development") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const apiGateway =
    process.env.API_GATEWAY ?? process.env.NEXT_PUBLIC_API_GATEWAY;
  if (!apiGateway) {
    return NextResponse.json(
      { proxyError: true, message: "Missing API_GATEWAY env var" },
      { status: 500 }
    );
  }

  const proxyOrigin =
    process.env.API_PROXY_ORIGIN ??
    process.env.NEXT_PUBLIC_API_PROXY_ORIGIN ??
    "";

  try {
    const { path } = await ctx.params;

    // optional hardening
    if (!isAllowedPath(path)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const targetUrl = buildUpstreamUrl(req, apiGateway, path);
    const method = req.method.toUpperCase();
    const headers = forwardHeaders(req, proxyOrigin);

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
