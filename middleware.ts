import createMiddleware from "next-intl/middleware";
import { routing } from "./navigation";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDashboard =
    pathname.includes("/dashboard") || pathname.match(/^\/(en|fr)\/dashboard/);

  // In demo mode, skip auth check and set a demo cookie if missing
  if (isDemoMode && isDashboard) {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      const response = intlMiddleware(request);
      response.cookies.set("auth_token", "demo_token", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
      return response;
    }
    return intlMiddleware(request);
  }

  // Check auth cookie
  const token = request.cookies.get("auth_token")?.value;

  if (isDashboard && !token) {
    // Determine locale to redirect to
    const locale = pathname.match(/^\/(en|fr)/)?.[1] || "en";
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(fr|en)/:path*"],
};
