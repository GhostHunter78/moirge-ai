import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";

  response.headers.set("x-locale", locale);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
