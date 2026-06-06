import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

const protectedRoutes = [
  "/dashboard",
  "/interview/setup",
  "/interview/technical",
  "/interview/hr",
  "/interview/multi-agent",
  "/group-discussion",
  "/report",
  "/admin"
];

const authRoutes = ["/login", "/signup", "/verify-email"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => nextUrl.pathname.startsWith(route));

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
    return;
  }

  if (isProtectedRoute && !isLoggedIn) {
    let from = nextUrl.pathname;
    if (nextUrl.search) {
      from += nextUrl.search;
    }
    return Response.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
