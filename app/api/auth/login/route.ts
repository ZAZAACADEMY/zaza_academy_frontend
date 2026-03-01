import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const DEMO_RESPONSE = {
  access_token: "demo_token",
  refresh_token: "demo_refresh_token",
  user: {
    id: "demo-user-1",
    email: "demo@zaza.academy",
    firstName: "Sarah",
    lastName: "Demo",
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let data;
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      data = await res.json();

      if (!res.ok) {
        // If backend rejects and demo mode is on, fall through to demo response
        if (!isDemoMode) {
          return NextResponse.json(data, { status: res.status });
        }
        console.warn("[Demo Mode] Backend rejected login, using demo user.");
        data = DEMO_RESPONSE;
      }
    } catch (fetchError) {
      // Backend unreachable
      if (!isDemoMode) {
        console.error("Login Proxy Error:", fetchError);
        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }
      console.warn("[Demo Mode] Backend unreachable, using demo user.");
      data = DEMO_RESPONSE;
    }

    // Set HttpOnly Cookies
    const cookieStore = await cookies();

    if (data.access_token) {
      cookieStore.set("auth_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60, // 1 day
      });
    }

    if (data.refresh_token) {
      cookieStore.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Login Proxy Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
