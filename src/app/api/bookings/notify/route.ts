import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type RawNotifyBookingRow = {
  id: string;
  user_id: string;
  creator_id: string;
  price: number;
  message: string | null;
  created_at: string;
  player: { display_name: string } | null;
  creator_game: { unit: string; game: { name: string } | null } | null;
  category: { name: string } | null;
};

/**
 * Playerが申込を送った直後にBookingFormから呼ばれる。
 * Creatorのメールアドレスはauth.usersにしかなくRLS配下では読めないため、
 * service roleクライアント(admin.ts)でここだけ特別に取得する。
 * 通知メールの送信に失敗しても申込自体は既に成立しているため、
 * ここでのエラーはログに残すのみでレスポンスは200で返す。
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const bookingId = body?.bookingId;

  if (!bookingId || typeof bookingId !== "string") {
    return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: booking, error: bookingError } = await admin
    .from("bookings")
    .select(
      `id, user_id, creator_id, price, message, created_at,
       player:profiles!user_id(display_name),
       creator_game:creator_games(unit, game:games(name)),
       category:categories(name)`,
    )
    .eq("id", bookingId)
    .single()
    .returns<RawNotifyBookingRow>();

  if (bookingError || !booking) {
    console.error("[bookings/notify] booking not found", bookingId, bookingError);
    return NextResponse.json({ error: "booking not found" }, { status: 404 });
  }

  if (booking.user_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { data: creatorAuth, error: creatorAuthError } =
    await admin.auth.admin.getUserById(booking.creator_id);
  const creatorEmail = creatorAuth?.user?.email;

  if (creatorAuthError || !creatorEmail) {
    console.error(
      "[bookings/notify] creator email not found",
      booking.creator_id,
      creatorAuthError,
    );
    return NextResponse.json({ sent: false }, { status: 200 });
  }

  const dashboardUrl = `${request.nextUrl.origin}/dashboard/requests`;
  const playerName = booking.player?.display_name ?? "不明なユーザー";
  const gameName = booking.creator_game?.game?.name ?? "不明なゲーム";
  const categoryName = booking.category?.name ?? "-";
  const unit = booking.creator_game?.unit ?? "1回";

  const bodyLines = [
    `${playerName}さんから新しい申込が届きました。`,
    "",
    `ゲーム: ${gameName}(${categoryName})`,
    `料金: ¥${booking.price.toLocaleString()} / ${unit}`,
    booking.message ? `メッセージ: ${booking.message}` : null,
    "",
    `申込内容を確認する: ${dashboardUrl}`,
  ].filter((line): line is string => line !== null);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: sendError } = await resend.emails.send({
      from: "GameMatch <onboarding@resend.dev>",
      to: creatorEmail,
      subject: "【GameMatch】新しい申込が届きました",
      text: bodyLines.join("\n"),
    });

    if (sendError) {
      console.error("[bookings/notify] resend error", bookingId, sendError);
      return NextResponse.json({ sent: false }, { status: 200 });
    }
  } catch (err) {
    console.error("[bookings/notify] resend threw", bookingId, err);
    return NextResponse.json({ sent: false }, { status: 200 });
  }

  return NextResponse.json({ sent: true }, { status: 200 });
}
