import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// List of paths that don't require authentication
const publicPaths = ["/", "/login", "/signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Redirect /manage-account to /manage-account/my-profile
  const manageAccountMatch = pathname.match(/^\/manage-account$/);
  if (manageAccountMatch) {
    return NextResponse.redirect(
      new URL("/manage-account/my-profile", request.url),
    );
  }

  // If user has token and tries to access login/signup, redirect to home
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to public paths without token
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // If no token is present, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Property category redirects
    "/list-property/rent/:path*",
    "/list-property/resale/:path*",
    "/list-property/flatmate/:path*",

    // Protected routes that require authentication
    "/edit-property/:path*",
    "/my-property-details/:path*",
    "/manage-account",
    // "/buy-connects",
    // Add other protected routes here
  ],
};
