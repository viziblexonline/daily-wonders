import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminSession } from "@/lib/adminAuth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Private admin panel — cookie auth only (no Supabase emails)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!isValidAdminSession(token)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (isValidAdminSession(token)) {
      const adminUrl = request.nextUrl.clone();
      adminUrl.pathname = "/admin";
      adminUrl.search = "";
      return NextResponse.redirect(adminUrl);
    }
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !anonKey ||
    url.includes("YOUR_PROJECT") ||
    anonKey.includes("YOUR_ANON_KEY")
  ) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
