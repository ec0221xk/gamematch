import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";

/**
 * クライアントコンポーネント(ブラウザ側)で使うSupabaseクライアント。
 * ログイン・ログアウトなど、ユーザーの操作に直接反応する処理で使用する。
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
