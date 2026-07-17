import { NextResponse, type NextRequest } from "next/server";

import { mergeVaryHeader } from "@/lib/http-vary";

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Vary", mergeVaryHeader(response.headers.get("Vary"), "Cookie"));
  return response;
}

export const config = {
  matcher: "/admin/preview/:path*"
};
