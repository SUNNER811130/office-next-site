import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-session";
import { mergeVaryHeader } from "@/lib/http-vary";

function withPreviewSecurityHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Vary", mergeVaryHeader(response.headers.get("Vary"), "Cookie"));
  return response;
}

function cleanSecret(value: string | undefined) {
  if (!value) return "";
  return value.trim().replace(/^['"](.*)['"]$/, "$1");
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value ?? "";
  const secret = cleanSecret(process.env.SESSION_SECRET);
  const session = await verifyAdminSessionToken(token, secret);

  if (!session) {
    return withPreviewSecurityHeaders(NextResponse.redirect(new URL("/admin/login", request.url)));
  }

  return withPreviewSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: "/admin/preview/:path*"
};
