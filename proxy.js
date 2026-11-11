import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { can } from "@/lib/rbac";

// pages that need a specific permission: a path matching pattern requires that permission
const PAGE_RULES = [
  { pattern: /^\/admin/, permission: "user:manage" },
  { pattern: /^\/news\/\d+\/edit/, permission: "news:update" },
];

// runs before every request that matches config.matcher
export async function proxy(request) {
  const user = await verifyToken(request.cookies.get("token")?.value);

  if (!user) {
    // not logged in or token expired: send to the login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // logged in but the role may not open this page: send back to the dashboard
  const rule = PAGE_RULES.find((rule) => rule.pattern.test(request.nextUrl.pathname));
  if (rule && !can(user.role, rule.permission)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// run the proxy only for the members area
export const config = {
  matcher: ["/dashboard/:path*", "/news/:path*", "/admin/:path*"],
};