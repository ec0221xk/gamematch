import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database";

/**
 * Server Components / Route Handlers / Server Actionsで使うSupabaseクライアント。
 * Cookieに保存されたログイン情報(セッション)を読み書きすることで、
 * サーバー側でも「誰がログインしているか」を判定できるようにする。
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Component内から呼ばれた場合、Cookieの書き込みはできない。
            // セッションの更新自体はmiddleware.tsが担うため、ここでは無視してよい。
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // 上記と同様の理由で無視してよい。
          }
        },
      },
    },
  );
}
