import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ──── ONLY ENABLE THIS FALLBACK WHEN RUNNING ON LOCALHOST && SERVER IS DOWN ────
const serverDownFlag = false;

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  if (pathname === "/" || pathname.startsWith("/admin")) {
    const loginURL = new URL("/login", request.url);
    const dashURL = new URL("/admin/dashboard", request.url);
    const fallbackToken = "FALLBACK_DEV_ADMIN_TOKEN";
    const tokenName = "adminToken";

    const existingToken = request.cookies.get(tokenName)?.value;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]";

    // ──── Activate fallback only on localhost when serverDownFlag === true ────
    const serverDown = isLocalhost && serverDownFlag;

    // ──── If fallback is active (serverDown = true) and no token exists, set it & redirect ────
    if (serverDown && !existingToken) {
      const response = NextResponse.redirect(dashURL);
      response.cookies.set({
        name: tokenName,
        value: fallbackToken,
        httpOnly: false,
        path: "/",
        sameSite: "lax",
        secure: false,
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

    if (!existingToken) {
      return NextResponse.redirect(loginURL);
    }
    if (pathname === "/") {
      return NextResponse.redirect(dashURL);
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
