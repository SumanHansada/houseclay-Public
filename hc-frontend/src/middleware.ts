import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// List of paths that don't require authentication
const publicPaths = ["/", "/login", "/signup", "/buy-connects"];

export function middleware(request: NextRequest) {
  const start = performance.now();
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // If no token is present, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user has token and tries to access login/signup, redirect to home
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect /manage-account to /manage-account/my-profile
  const manageAccountMatch = pathname.endsWith("/manage-account");
  if (manageAccountMatch) {
    return NextResponse.redirect(
      new URL("/manage-account/my-profile", request.url),
    );
  }

  // Allow access to public paths without token
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  res.headers.set(
    "Server-Timing",
    `mw;dur=${(performance.now() - start).toFixed(1)}`,
  );
  return res;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Protected routes that require authentication
    "/list-property/rent/:path*",
    "/list-property/resale/:path*",
    "/list-property/flatmate/:path*",

    "/edit-property/rent/:path*",
    "/edit-property/resale/:path*",
    "/edit-property/flatmate/:path*",

    "/my-property-details/:path*",
    "/manage-account/:path*",
  ],
};
