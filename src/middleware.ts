import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAuthApi = pathname === "/api/admin/login" || pathname === "/api/admin/logout";
  const isProtectedPage = pathname.startsWith("/admin") && !isLoginPage;
  const isProtectedApi = pathname.startsWith("/api/admin") && !isAuthApi;

  if (!isProtectedPage && !isProtectedApi && !isLoginPage) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshes the session if expired, required for Server Components.
  const { data } = await supabase.auth.getUser();
  const hasSession = !!data.user;

  // Note: this only confirms a valid Supabase session exists. The actual
  // admin_users membership check happens in requireAdmin() inside each
  // /api/admin/** route handler (DB access isn't reliable from the Edge
  // runtime middleware runs in).
  if ((isProtectedPage || isProtectedApi) && !hasSession) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isLoginPage && hasSession) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
