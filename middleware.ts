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
  const siteId = pathSegments[1] || ""; // Assuming siteId is the second segment
  const menuItem = pathSegments[2] || ""; // Assuming siteId is the second segment
  const widgetType = pathSegments[3] || ""; // Assuming widgetType is the third segment
  const widgetidx = pathSegments[4] || ""; // Assuming widgetidx is the second segment
  const itemidx = pathSegments[5] || ""; // Assuming itemidx is the second segment

  // Step 1: Add custom headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-siteid", siteId);
  requestHeaders.set("x-menu", menuItem);
  requestHeaders.set("x-wtype", widgetType);
  requestHeaders.set("x-widx", widgetidx);
  requestHeaders.set("x-itemidx", itemidx);
  console.log("in middleware");

  const sessionCookie = request.cookies.get("session");
  const isProtectedRoute = pathname.startsWith(`/${siteId}/${protectedRoutes}`);

  // Step 2: Handle protected routes and session validation
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Step 3: Update session token if it exists
  /*
  if (sessionCookie) {
    console.log(request.nextUrl.pathname);
    console.log("sessionCookie", sessionCookie);
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
  */

  const hostname = request.headers.get("host") || "";

  const subdomain =
    process.env.NODE_ENV === "development"
      ? hostname.replace(".lvh.me:3000", "")
      : hostname.replace(".reachu.org", "");
  console.log("subdomain", subdomain);

  console.log("hostname", hostname);

  // Skip root domain (e.g., www or no subdomain)
  if (
    subdomain === "www" ||
    subdomain === "localhost" ||
    hostname === "reachu.org" ||
    subdomain === "lvh.me" ||
    subdomain === "lvh.me:3000" ||
    subdomain === "localhost:3000"
  ) {
    console.log("skipping root domain");
    return NextResponse.next();
  }

  // Rewrite URL from `/admin` → `/{subdomain}/admin`
  console.log("pathname", pathname);

  //return response;
  // Skip rewrite for known public routes
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  /*
  if (pathname !== "/" && !isPublicPath) {
    url.pathname = `/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  } else {
    return NextResponse.next();
  }
  */

  if (!isPublicPath) {
    url.pathname =
      pathname === "/" ? `/${subdomain}` : `/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }
}

export const config = {
  // Match all routes except API, static assets, and favicon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
