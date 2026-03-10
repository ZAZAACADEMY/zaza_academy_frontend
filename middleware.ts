import createMiddleware from "next-intl/middleware";
import { routing } from "./navigation";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

/**
 * Détecte la locale préférée de l'utilisateur :
 * 1. Cookie NEXT_LOCALE (choix manuel de l'utilisateur)
 * 2. Header Accept-Language : si contient "fr" → français, sinon → anglais
 * 3. Défaut : anglais (pour les pays non-francophones)
 */
function detectLocale(request: NextRequest): "fr" | "en" {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale === "fr" || cookieLocale === "en") {
    return cookieLocale;
  }
  const acceptLanguage = request.headers.get("accept-language") || "";
  return /\bfr\b/i.test(acceptLanguage) ? "fr" : "en";
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocalePrefix = /^\/(en|fr)(\/|$)/.test(pathname);

  // Si pas de préfixe de locale dans l'URL, détecter et rediriger
  if (!hasLocalePrefix) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);
    // Persister le choix détecté en cookie pour les visites suivantes
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

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
    const locale = pathname.match(/^\/(en|fr)/)?.[1] || "fr";
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  // Intercepter toutes les routes sauf les fichiers statiques et les API internes Next.js
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
