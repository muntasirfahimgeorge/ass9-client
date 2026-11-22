
import { NextResponse, type NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  requestHeaders.delete("x-fixmate-return-to");

  requestHeaders.set(
    "x-fixmate-return-to",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
