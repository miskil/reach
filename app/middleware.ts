import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { signToken, verifyToken } from "@/lib/auth/session";

const protectedRoutes = "admin";
const PUBLIC_PATHS = ["/signup", "/sign-in", "/login"];

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const { pathname } = request.nextUrl;
  const origin = url.origin;
  const pathSegments = pathname ? pathname.split("/") : [];

  const siteId = pathSegments[1] || "";
  const menuItem = pathSegments[2] || "";
  const widgetType = pathSegments[3] || "";
  const widgetidx = pathSegments[4] || "";
  const itemidx = pathSegments[5] || "";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-siteid", siteId);
  requestHeaders.set("x-menu", menuItem);
  requestHeaders.set("x-wtype", widgetType);
  requestHeaders.set("x-widx", widgetidx);
  requestHeaders.set("x-itemidx", itemidx);

  const sessionCookie = request.cookies.get("session");
  const isProtectedRoute = pathname.startsWith(`/${siteId}/${protectedRoutes}`);

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (sessionCookie) {
    try {
      const parsed = await verifyToken(sessionCookie.value);
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

      response.cookies.set({
        name: "session",
        value: await signToken({
          ...parsed,
          expires: expiresInOneDay.toISOString(),
        }),
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: expiresInOneDay,
      });
    } catch (error) {
      console.error("Error updating session:", error);
      response.cookies.delete("session");
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }
  }

  const hostname = request.headers.get("host") || "";
  const subdomain =
    process.env.NODE_ENV === "development"
      ? hostname.replace(".lvh.me:3000", "")
      : hostname.replace(".reachu.org", "");

  // Skip rewrite for root domain
  if (
    subdomain === "www" ||
    subdomain === "localhost" ||
    hostname === "reachu.org" ||
    subdomain === "lvh.me" ||
    subdomain === "lvh.me:3000" ||
    subdomain === "localhost:3000"
  ) {
    return NextResponse.next();
  }

  // Skip rewrite for known public routes
  // Public paths that should never be rewritten (like /signup)
  const PUBLIC_PATHS = ["/sign-up", "/sign-in", "/login"];
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  console.log("isPublicPath", isPublicPath);
  console.log("pathname", pathname);
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Rewrite from /admin → /[subdomain]/admin
  if (pathname !== "/") {
    url.pathname = `/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
