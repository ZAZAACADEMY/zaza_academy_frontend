import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// Demo responses for specific endpoints when backend is unavailable
const DEMO_ENDPOINTS: Record<string, any> = {
  "auth/register": {
    access_token: "demo_token",
    refresh_token: "demo_refresh_token",
    user: {
      id: "demo-user-1",
      email: "demo@zaza.academy",
      firstName: "Sarah",
      lastName: "Demo",
    },
  },
};

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

    // Detect when the backend is unreachable (ECONNREFUSED, fetch failed, etc.)
    const errorMessage = String(error);
    const isBackendDown =
      errorMessage.includes("fetch failed") ||
      errorMessage.includes("ECONNREFUSED") ||
      errorMessage.includes("ENOTFOUND") ||
      errorMessage.includes("UND_ERR_CONNECT_TIMEOUT");

    if (isBackendDown && isDemoMode) {
      // In demo mode, check if we have a mock response for this endpoint
      const { path: pathSegments } = await params;
      const pathStr = pathSegments.join("/");
      const cleanPath = pathStr.replace(/\/$/, ""); // Remove trailing slash

      const demoData = DEMO_ENDPOINTS[cleanPath];
      if (demoData) {
        console.warn(`[Demo Mode] Returning mock data for: ${cleanPath}`);

        // If it's an auth endpoint, also set the cookie
        if (cleanPath.startsWith("auth/") && demoData.access_token) {
          const cookieStore = await cookies();
          cookieStore.set("auth_token", demoData.access_token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60,
          });
        }

        return NextResponse.json(demoData);
      }
    }

    if (isBackendDown) {
      return NextResponse.json(
        {
          message: "Backend Unavailable",
          details:
            "The backend server is not reachable. Make sure it is running.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { message: "Internal Proxy Error", details: errorMessage },
      { status: 500 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
