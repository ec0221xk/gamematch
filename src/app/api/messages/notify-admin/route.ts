import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type RawMessageRow = {
  id: string;
  user_id: string;
  sender_is_admin: boolean;
  body: string;
};

/**
 * ユーザーが運営からのメッセージに返信した直後にMessageThreadから呼ばれる。
 * 運営(ADMIN_USER_ID)のメールアドレスはauth.usersにしかなくRLS配下では読めないため、
 * service roleクライアント(admin.ts)でここだけ特別に取得する。
 * 通知メールの送信に失敗しても返信自体は既に成立しているため、
 * ここでのエラーはログに残すのみでレスポンスは200で返す。
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const messageId = body?.messageId;

  if (!messageId || typeof messageId !== "string") {
    return NextResponse.json({ error: "messageId is required" }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: message, error: messageError } = await admin
    .from("admin_messages")
    .select("id, user_id, sender_is_admin, body")
    .eq("id", messageId)
    .single()
    .returns<RawMessageRow>();

  if (messageError || !message) {
    console.error("[messages/notify-admin] message not found", messageId, messageError);
    return NextResponse.json({ error: "message not found" }, { status: 404 });
  }

  // 本人の返信(sender_is_admin=false)についての通知リクエストであることを確認する
  if (message.user_id !== user.id || message.sender_is_admin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const adminUserId = process.env.ADMIN_USER_ID;
  if (!adminUserId) {
    console.error("[messages/notify-admin] ADMIN_USER_ID is not set");
    return NextResponse.json({ sent: false }, { status: 200 });
  }

  const { data: adminAuth, error: adminAuthError } =
    await admin.auth.admin.getUserById(adminUserId);
  const adminEmail = adminAuth?.user?.email;

  if (adminAuthError || !adminEmail) {
    console.error(
      "[messages/notify-admin] admin email not found",
      adminUserId,
      adminAuthError,
    );
    return NextResponse.json({ sent: false }, { status: 200 });
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const threadUrl = `${request.nextUrl.origin}/admin/messages/${user.id}`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: sendError } = await resend.emails.send({
      from: "GameMatch <onboarding@resend.dev>",
      to: adminEmail,
      subject: "【GameMatch】ユーザーから返信が届きました",
      text: [
        `${profile?.display_name ?? "不明なユーザー"}さんから返信が届きました。`,
        "",
        message.body,
        "",
        `管理画面で確認する: ${threadUrl}`,
      ].join("\n"),
    });

    if (sendError) {
      console.error("[messages/notify-admin] resend error", messageId, sendError);
      return NextResponse.json({ sent: false }, { status: 200 });
    }
  } catch (err) {
    console.error("[messages/notify-admin] resend threw", messageId, err);
    return NextResponse.json({ sent: false }, { status: 200 });
  }

  return NextResponse.json({ sent: true }, { status: 200 });
}
