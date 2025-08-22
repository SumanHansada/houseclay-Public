import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// List of paths that don't require authentication
const publicPaths = ["/", "/login", "/signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Allow access to public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // If no token is present, redirect to home
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Protected routes that require authentication
    "/list-property/rent/:path*",
    "/list-property/resale/:path*",
    "/list-property/flatmate/:path*",
    "/profile/:path*",
    "/edit-property/:path*",
    "/my-property-details/:path*",
    // Add other protected routes here
  ],
};
