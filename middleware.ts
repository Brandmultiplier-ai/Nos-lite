import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_VERSIONS = new Set(["v1", "v2", "v3", "v4", "v5"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/v1", request.url));
  }

  const versionMatch = pathname.match(/^\/(v[^/]+)(\/|$)/);
  if (versionMatch && !VALID_VERSIONS.has(versionMatch[1])) {
    return NextResponse.redirect(new URL("/v1", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/v1/:path*", "/v2/:path*", "/v3/:path*", "/v4/:path*", "/v5/:path*", "/v:version/:path*"],
};
