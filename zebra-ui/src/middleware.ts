import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_NAME = "admin-token";

const protectedPaths = ["/admin"];
const authPath = "/login";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const { pathname, searchParams } = request.nextUrl;

  if (searchParams.get("clear_session") === "true") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.delete("clear_session");
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  // If trying to access protected routes without token -> Login
  if (!token && protectedPaths.some((path) => pathname.startsWith(path))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access auth routes WITH token -> Dashboard
  if (token && authPath === pathname) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
