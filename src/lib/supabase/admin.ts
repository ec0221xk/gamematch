import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/**
 * service roleキーを使うサーバー専用クライアント。
 * RLSを無視して全テーブル・auth.usersにアクセスできるため、
 * Route Handlerなどサーバー側のコードからのみ使用すること。
 * "server-only"により、Client Componentから誤ってimportした場合はビルドエラーになる。
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
