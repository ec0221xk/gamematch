import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/types/database";
import type { QueryResult } from "@/lib/types/query";

export interface BookingSummary {
  id: string;
  otherPartyName: string;
  /** 承認済み(accepted)の申込でのみ値が入る。それ以外は必ずnull(承認前の連絡先漏洩防止)。 */
  otherPartyDiscordId: string | null;
  gameName: string;
  categoryName: string;
  price: number;
  unit: string;
  message: string | null;
  status: BookingStatus;
  createdAt: string;
  /** Creatorのプロフィールに設定された支払い条件(申込時点ではなく現在の設定)。 */
  paymentTiming: string | null;
  paymentMethods: string[];
}

type RawBookingRow = {
  id: string;
  price: number;
  message: string | null;
  status: BookingStatus;
  created_at: string;
  category: { name: string } | null;
  creator_game: { unit: string; game: { name: string } | null } | null;
  other_party: { display_name: string; discord_id?: string | null } | null;
  creator_profile: {
    payment_timing: string | null;
    payment_methods: string[] | null;
  } | null;
};

function mapBookingRow(row: RawBookingRow): BookingSummary {
  return {
    id: row.id,
    otherPartyName: row.other_party?.display_name ?? "不明なユーザー",
    otherPartyDiscordId:
      row.status === "accepted" ? row.other_party?.discord_id ?? null : null,
    gameName: row.creator_game?.game?.name ?? "不明なゲーム",
    categoryName: row.category?.name ?? "-",
    price: row.price,
    unit: row.creator_game?.unit ?? "1回",
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    paymentTiming: row.creator_profile?.payment_timing ?? null,
    paymentMethods: row.creator_profile?.payment_methods ?? [],
  };
}

// creator_profileは常にCreator本人(bookings.creator_id)の設定。
// 閲覧者がPlayer/Creatorのどちらでも同じmapBookingRowを使えるよう、
// other_party(閲覧者から見た相手)とは別に、Creator側の支払い設定を明示的に結合する。
const BOOKING_SELECT =
  "id, price, message, status, created_at, category:categories(name), creator_game:creator_games(unit, game:games(name)), creator_profile:profiles!creator_id(payment_timing, payment_methods)";

/**
 * Creatorが受け取った申込一覧(/dashboard/requests)。
 * otherPartyには申込んだPlayerの表示名が入る。
 */
export async function getReceivedBookings(
  creatorId: string,
): Promise<QueryResult<BookingSummary[]>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `${BOOKING_SELECT}, other_party:profiles!user_id(display_name, discord_id)`,
    )
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false })
    .returns<RawBookingRow[]>();

  if (error || !data) {
    console.error("getReceivedBookings error:", error);
    return { ok: false };
  }

  return { ok: true, data: data.map(mapBookingRow) };
}

/**
 * Playerが送った申込状況(/dashboard/my-requests)。
 * otherPartyには依頼先Creatorの表示名が入る。
 */
export async function getSentBookings(
  userId: string,
): Promise<QueryResult<BookingSummary[]>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `${BOOKING_SELECT}, other_party:profiles!creator_id(display_name, discord_id)`,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<RawBookingRow[]>();

  if (error || !data) {
    console.error("getSentBookings error:", error);
    return { ok: false };
  }

  return { ok: true, data: data.map(mapBookingRow) };
}
