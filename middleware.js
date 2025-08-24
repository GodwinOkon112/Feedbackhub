import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const isSignedIn = req.cookies.get("admin-auth")?.value === "true";

  // Allow access to signin & signup
  if (
    pathname.startsWith("/admin/signin") ||
    pathname.startsWith("/admin/signup")
  ) {
    if (isSignedIn) {
      // already logged in → redirect to dashboard
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!isSignedIn) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // protect all /admin routes
};
