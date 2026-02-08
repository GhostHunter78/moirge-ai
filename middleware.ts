import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/forgot-password",
  "/verify-email",
  "/store", // Public store pages: /store/[sellerId] — anyone can view a store
];

// Check if a path is a public route
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle locale
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";

  // Skip authentication check for public routes
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next();
    response.headers.set("x-locale", locale);
    return response;
  }

  // Skip authentication check for API routes
  if (pathname.startsWith("/api")) {
    const response = NextResponse.next();
    response.headers.set("x-locale", locale);
    return response;
  }

  // Check authentication for protected routes
  try {
    let responseToReturn: NextResponse = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            responseToReturn = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              responseToReturn.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If no user and trying to access protected route, redirect to signin
    if (!user) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Set locale header on the response
    responseToReturn.headers.set("x-locale", locale);
    return responseToReturn;
  } catch {
    // If there's an error checking auth, redirect to signin
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
