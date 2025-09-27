import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// List of paths that don't require authentication
const publicPaths = ["/", "/login", "/signup"];

// Valid property categories
const validPropertyCategories = ["rent", "resale", "flatmate"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Handle property category redirects
  const propertyCategoryMatch = pathname.match(/^\/list-property\/([^\/]+)$/);
  if (propertyCategoryMatch) {
    const category = propertyCategoryMatch[1].toLowerCase();

    if (validPropertyCategories.includes(category)) {
      // Redirect to property-details step
      return NextResponse.redirect(
        new URL(`/list-property/${category}/property-details`, request.url),
      );
    } else {
      // Redirect to home for invalid category
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

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
    // Property category redirects
    "/list-property/:path*",
    // Protected routes that require authentication
    "/profile/:path*",
    "/edit-property/:path*",
    "/my-property-details/:path*",
    "/buy-connects",
    // Add other protected routes here
  ],
};
