import { createAdminClient } from "@/lib/supabase/admin";
import type { QueryResult } from "@/lib/types/query";

export interface AdminMessageThreadSummary {
  userId: string;
  displayName: string;
  isCreator: boolean;
  lastMessageBody: string;
  lastMessageSenderIsAdmin: boolean;
  lastMessageAt: string;
  /** このユーザーからの返信のうち、運営がまだ読んでいない件数 */
  unreadFromUserCount: number;
}

export interface AdminMessageRow {
  id: string;
  senderIsAdmin: boolean;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface UserOption {
  id: string;
  displayName: string;
  isCreator: boolean;
}

type RawMessageRow = {
  id: string;
  user_id: string;
  sender_is_admin: boolean;
  body: string;
  is_read: boolean;
  created_at: string;
};

/**
 * 全ユーザーとのスレッド一覧(/admin/messages)用データ。
 * NOTES.mdに記載の既存方針(admin.tsの集計)に合わせ、view/RPCを追加せず
 * admin_messagesを全件取得しJS側で集計する。
 */
export async function getAdminMessageThreads(): Promise<
  QueryResult<AdminMessageThreadSummary[]>
> {
  const supabase = createAdminClient();

  const [messagesResult, profilesResult] = await Promise.all([
    supabase
      .from("admin_messages")
      .select("id, user_id, sender_is_admin, body, is_read, created_at")
      .order("created_at", { ascending: true })
      .returns<RawMessageRow[]>(),
    supabase.from("profiles").select("id, display_name, is_creator"),
  ]);

  if (messagesResult.error || profilesResult.error) {
    console.error("getAdminMessageThreads error:", {
      messagesError: messagesResult.error,
      profilesError: profilesResult.error,
    });
    return { ok: false };
  }

  const profileById = new Map(profilesResult.data.map((p) => [p.id, p]));
  const threads = new Map<string, AdminMessageThreadSummary>();

  // created_at昇順で処理しているため、後続の行で上書きしていくと自然に最新の内容が残る
  for (const row of messagesResult.data) {
    const profile = profileById.get(row.user_id);
    const isUnreadFromUser = row.sender_is_admin === false && !row.is_read;
    const existing = threads.get(row.user_id);

    if (!existing) {
      threads.set(row.user_id, {
        userId: row.user_id,
        displayName: profile?.display_name ?? "不明なユーザー",
        isCreator: profile?.is_creator ?? false,
        lastMessageBody: row.body,
        lastMessageSenderIsAdmin: row.sender_is_admin,
        lastMessageAt: row.created_at,
        unreadFromUserCount: isUnreadFromUser ? 1 : 0,
      });
      continue;
    }

    existing.lastMessageBody = row.body;
    existing.lastMessageSenderIsAdmin = row.sender_is_admin;
    existing.lastMessageAt = row.created_at;
    if (isUnreadFromUser) {
      existing.unreadFromUserCount += 1;
    }
  }

  return {
    ok: true,
    data: [...threads.values()].sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
    ),
  };
}

/**
 * 特定ユーザーとのスレッド全文(/admin/messages/[userId])。
 */
export async function getAdminMessageThread(userId: string): Promise<
  QueryResult<{
    displayName: string;
    isCreator: boolean;
    messages: AdminMessageRow[];
  }>
> {
  const supabase = createAdminClient();

  const [profileResult, messagesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, is_creator")
      .eq("id", userId)
      .single(),
    supabase
      .from("admin_messages")
      .select("id, sender_is_admin, body, is_read, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
  ]);

  if (profileResult.error || messagesResult.error) {
    console.error("getAdminMessageThread error:", {
      profileError: profileResult.error,
      messagesError: messagesResult.error,
    });
    return { ok: false };
  }

  return {
    ok: true,
    data: {
      displayName: profileResult.data.display_name,
      isCreator: profileResult.data.is_creator,
      messages: messagesResult.data.map((row) => ({
        id: row.id,
        senderIsAdmin: row.sender_is_admin,
        body: row.body,
        isRead: row.is_read,
        createdAt: row.created_at,
      })),
    },
  };
}

/**
 * ユーザーからの返信を、運営が読んだものとしてまとめて既読にする。
 * スレッド詳細ページ表示時に呼び出す(失敗してもページ表示自体は継続させるため戻り値は持たない)。
 */
export async function markUserMessagesReadByAdmin(userId: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("admin_messages")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("sender_is_admin", false)
    .eq("is_read", false);

  if (error) {
    console.error("markUserMessagesReadByAdmin error:", error);
  }
}

/**
 * 新規メッセージの送信先選択(ピッカー)用の全ユーザー一覧。
 */
export async function getUserOptions(): Promise<QueryResult<UserOption[]>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, is_creator")
    .order("display_name", { ascending: true });

  if (error || !data) {
    console.error("getUserOptions error:", error);
    return { ok: false };
  }

  return {
    ok: true,
    data: data.map((row) => ({
      id: row.id,
      displayName: row.display_name,
      isCreator: row.is_creator,
    })),
  };
}

/**
 * 運営ダッシュボード(/admin)に表示する「ユーザーからの未読返信」件数。
 */
export async function getUnreadReplyCount(): Promise<QueryResult<number>> {
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from("admin_messages")
    .select("id", { count: "exact", head: true })
    .eq("sender_is_admin", false)
    .eq("is_read", false);

  if (error) {
    console.error("getUnreadReplyCount error:", error);
    return { ok: false };
  }

  return { ok: true, data: count ?? 0 };
}

/**
 * 運営からユーザー(複数可)へメッセージを送信する。
 * sender_is_admin=trueでのinsertはRLSで拒否される設計のため、
 * service roleクライアントを使うこの関数からのみ許可する
 * (呼び出し元はADMIN_USER_IDと一致することを確認済みのRoute Handlerのみ)。
 */
export async function sendAdminMessages(
  userIds: string[],
  body: string,
): Promise<QueryResult<{ userId: string }[]>> {
  const supabase = createAdminClient();

  const rows = userIds.map((userId) => ({
    user_id: userId,
    sender_is_admin: true,
    body,
  }));

  const { data, error } = await supabase
    .from("admin_messages")
    .insert(rows)
    .select("user_id");

  if (error || !data) {
    console.error("sendAdminMessages error:", error);
    return { ok: false };
  }

  return { ok: true, data: data.map((row) => ({ userId: row.user_id })) };
}
