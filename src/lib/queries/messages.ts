import { createClient } from "@/lib/supabase/server";
import type { QueryResult } from "@/lib/types/query";

export interface AdminMessageRow {
  id: string;
  senderIsAdmin: boolean;
  body: string;
  isRead: boolean;
  createdAt: string;
}

type RawRow = {
  id: string;
  sender_is_admin: boolean;
  body: string;
  is_read: boolean;
  created_at: string;
};

/**
 * ログインユーザー自身の「運営からのお知らせ」スレッド全文(/dashboard/messages)。
 * RLS(admin_messages_select_own)により自分宛てのスレッドのみ取得される。
 */
export async function getMyMessageThread(
  userId: string,
): Promise<QueryResult<AdminMessageRow[]>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("admin_messages")
    .select("id, sender_is_admin, body, is_read, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .returns<RawRow[]>();

  if (error || !data) {
    console.error("getMyMessageThread error:", error);
    return { ok: false };
  }

  return {
    ok: true,
    data: data.map((row) => ({
      id: row.id,
      senderIsAdmin: row.sender_is_admin,
      body: row.body,
      isRead: row.is_read,
      createdAt: row.created_at,
    })),
  };
}

/**
 * 運営からの未読メッセージ件数。DashboardTabsのバッジ表示に使う。
 */
export async function getUnreadAdminMessageCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("admin_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("sender_is_admin", true)
    .eq("is_read", false);

  if (error) {
    console.error("getUnreadAdminMessageCount error:", error);
    return 0;
  }

  return count ?? 0;
}

/**
 * 運営からの未読メッセージをまとめて既読にする。/dashboard/messages表示時に呼び出す。
 * RLS(admin_messages_update_mark_read)により自分宛て・運営送信の行のみ更新可能なため、
 * 失敗してもページ表示自体は継続させる(戻り値は持たずログのみ)。
 */
export async function markAdminMessagesReadByUser(userId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("admin_messages")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("sender_is_admin", true)
    .eq("is_read", false);

  if (error) {
    console.error("markAdminMessagesReadByUser error:", error);
  }
}
