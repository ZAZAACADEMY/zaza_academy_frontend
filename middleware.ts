import createMiddleware from "next-intl/middleware";
import { routing } from "./navigation";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDashboard =
    pathname.includes("/dashboard") || pathname.match(/^\/(en|fr)\/dashboard/);

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
