import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAdminMessages } from "@/lib/queries/adminMessages";

/**
 * 管理画面(/admin/messages)から運営がユーザー(複数可)へメッセージを送るためのRoute Handler。
 * admin_messagesへのsender_is_admin=trueでの挿入はRLSで拒否される設計のため、
 * service roleクライアントを使うこの場所でのみ許可する。
 * メール通知の送信に失敗してもメッセージ自体は既に保存されているため、
 * ここでのエラーはログに残すのみでレスポンスは200で返す(bookings/notifyと同じ方針)。
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const userIds = body?.userIds;
  const messageBody = typeof body?.body === "string" ? body.body.trim() : "";

  if (
    !Array.isArray(userIds) ||
    userIds.length === 0 ||
    userIds.some((id) => typeof id !== "string") ||
    messageBody.length === 0
  ) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const insertResult = await sendAdminMessages(userIds, messageBody);

  if (!insertResult.ok) {
    return NextResponse.json({ error: "insert failed" }, { status: 500 });
  }

  const admin = createAdminClient();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const dashboardUrl = `${request.nextUrl.origin}/dashboard/messages`;

  await Promise.all(
    userIds.map(async (userId) => {
      try {
        const { data: authUser, error: authError } =
          await admin.auth.admin.getUserById(userId);
        const email = authUser?.user?.email;

        if (authError || !email) {
          console.error(
            "[admin/messages/send] recipient email not found",
            userId,
            authError,
          );
          return;
        }

        const { error: sendError } = await resend.emails.send({
          from: "GameMatch <onboarding@resend.dev>",
          to: email,
          subject: "【GameMatch】運営からメッセージが届きました",
          text: [
            "運営からメッセージが届きました。",
            "",
            messageBody,
            "",
            `マイページで確認する: ${dashboardUrl}`,
          ].join("\n"),
        });

        if (sendError) {
          console.error("[admin/messages/send] resend error", userId, sendError);
        }
      } catch (err) {
        console.error("[admin/messages/send] resend threw", userId, err);
      }
    }),
  );

  return NextResponse.json({ sent: insertResult.data.length }, { status: 200 });
}
