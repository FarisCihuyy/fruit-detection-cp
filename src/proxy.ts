import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token");

  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const isProtectedRoute = pathname.startsWith("/playground");

  // sudah login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // belum login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/playground/:path*"],
};
