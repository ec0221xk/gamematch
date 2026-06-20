import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * すべてのページアクセス時にログインセッションの有効期限をチェックし、
 * 必要であれば自動的に更新する。
 * 加えて、以下は未ログインの場合に/loginへリダイレクトする
 * (Creator/User兼任のため、role別の細かい権限分岐はここでは行わない)。
 * - /dashboard配下(マイページ)
 * - /creators/:id/request(申込フォーム)
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // セッションが切れていればここでリフレッシュされる
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    /^\/creators\/[^/]+\/request$/.test(pathname);

  if (!user && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
