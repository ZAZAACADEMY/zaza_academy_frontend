import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function proxy(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;

    const pathStr = path.join("/");
    // Ensure we preserve the trailing slash if the original request had it (important for Django)
    const incomingUrl = new URL(request.url);
    const shouldAddSlash = incomingUrl.pathname.endsWith("/");

    const queryString = incomingUrl.search;
    const targetUrl = `${BACKEND_URL}/${pathStr}${shouldAddSlash ? "/" : ""}${queryString}`;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("cookie"); // Do not pass browser auth cookies to backend
    // Only force JSON if we intend to, otherwise pass original content-type
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const body =
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.text()
        : undefined;

    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    // Handle response
    const responseData = await res.text();

    // Log backend errors for debugging
    if (!res.ok) {
      if (res.status >= 500) {
        console.error(
          `[Proxy] Backend Error ${res.status} at ${targetUrl}:`,
          responseData.slice(0, 200),
        );
      }
    }

    return new NextResponse(responseData, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error(`[Proxy] Critical Error:`, error);
    return NextResponse.json(
      { message: "Internal Proxy Error", details: String(error) },
      { status: 500 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
