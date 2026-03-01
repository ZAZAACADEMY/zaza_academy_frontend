import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const DEMO_USER = {
  id: "demo-user-1",
  email: "demo@zaza.academy",
  firstName: "Sarah",
  lastName: "Demo",
  role: "parent" as const,
  subscriptionStatus: "active" as const,
  children: [{ id: "1", name: "Demo Child", age: 10 }],
};

/**
 * GET /api/auth/me
 * Lightweight session check — returns current user if auth_token cookie is valid.
 * Used by the Login page to auto-redirect already-authenticated users.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // In demo mode with a demo token, return the demo user directly
  if (isDemoMode && token === "demo_token") {
    return NextResponse.json({ authenticated: true, user: DEMO_USER });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/auth/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      // If backend rejects but we're in demo mode, still return demo user
      if (isDemoMode) {
        return NextResponse.json({ authenticated: true, user: DEMO_USER });
      }
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await res.json();
    return NextResponse.json({ authenticated: true, user });
  } catch {
    // Backend unreachable — in demo mode, return demo user
    if (isDemoMode) {
      return NextResponse.json({ authenticated: true, user: DEMO_USER });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
