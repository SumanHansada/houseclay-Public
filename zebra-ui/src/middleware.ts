import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// --- CONFIGURATION ---
const publicPaths = ["/", "/login", "/register"];
const adminRoot = "/admin/dashboard";
const loginPath = "/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Handle the root path "/"
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    // If logged in, go to dashboard. If not, go to login.
    url.pathname = token ? adminRoot : loginPath;
    return NextResponse.redirect(url);
  }

  // Handle public paths (login/register)
  if (publicPaths.includes(pathname)) {
    // If logged in, redirect away from public paths to the dashboard
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = adminRoot;
      return NextResponse.redirect(url);
    }
    // If not logged in, allow access to public paths
    return NextResponse.next();
  }

  // Handle protected admin paths (everything else)
  // If no token and not a public path, redirect to login
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // If token exists, allow access to the protected path
  return NextResponse.next();
}

export const config = {
  // Match all paths except for static assets and API routes
  matcher: ["/admin/:path*"],
};
