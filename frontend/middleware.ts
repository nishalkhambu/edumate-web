import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "edumate_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/health");

  const isProtected = pathname === "/dashboard" || pathname.startsWith("/dashboard/");


  if (!isPublic && isProtected) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  const isAdminProtected = pathname.startsWith("/dashboard/admin");

  if (isAdminProtected) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

