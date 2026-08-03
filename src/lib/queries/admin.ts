import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingStatus } from "@/lib/types/database";
import type { QueryResult } from "@/lib/types/query";

export interface BookingStatusCounts {
  pending: number;
  accepted: number;
  declined: number;
  completed: number;
  total: number;
}

export interface RankingEntry {
  name: string;
  count: number;
}

export interface RecentBookingSummary {
  id: string;
  requesterName: string;
  creatorName: string;
  gameName: string;
  categoryName: string;
  status: BookingStatus;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalCreators: number;
  totalOfferings: number;
  bookingCounts: BookingStatusCounts;
  /** accepted / (accepted + declined)。対応済みのうち承認された割合(pendingは分母から除外)。対応済みが0件の場合はnull。 */
  approvalRate: number | null;
  totalReports: number;
  popularGames: RankingEntry[];
  popularCategories: RankingEntry[];
  recentBookings: RecentBookingSummary[];
}

type RawBookingAggRow = {
  status: BookingStatus;
  category: { name: string } | null;
  creator_game: { game: { name: string } | null } | null;
};

type RawRecentBookingRow = {
  id: string;
  status: BookingStatus;
  created_at: string;
  category: { name: string } | null;
  creator_game: { game: { name: string } | null } | null;
  requester: { display_name: string } | null;
  creator: { display_name: string } | null;
};

const RECENT_BOOKINGS_LIMIT = 10;
const RANKING_LIMIT = 5;

function rankBy(counts: Map<string, number>): RankingEntry[] {
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, RANKING_LIMIT);
}

/**
 * 運営向けダッシュボード(/admin)の集計データ一式を取得する。
 * RLSを横断してprofiles/creator_games/bookings/reportsを読む必要があるため、
 * service roleクライアント(createAdminClient)を使用する。
 * 呼び出し側(src/app/admin/layout.tsx)で管理者確認済みであることが前提。
 */
export async function getAdminDashboardStats(): Promise<
  QueryResult<AdminDashboardStats>
> {
  const supabase = createAdminClient();

  const [usersCount, creatorsCount, offeringsCount, bookingAgg, reportsCount, recentBookings] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("is_creator", true),
      supabase
        .from("creator_games")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select(
          "status, category:categories(name), creator_game:creator_games(game:games(name))",
        )
        .returns<RawBookingAggRow[]>(),
      supabase.from("reports").select("id", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select(
          "id, status, created_at, category:categories(name), creator_game:creator_games(game:games(name)), requester:profiles!user_id(display_name), creator:profiles!creator_id(display_name)",
        )
        .order("created_at", { ascending: false })
        .limit(RECENT_BOOKINGS_LIMIT)
        .returns<RawRecentBookingRow[]>(),
    ]);

  if (
    usersCount.error ||
    creatorsCount.error ||
    offeringsCount.error ||
    bookingAgg.error ||
    reportsCount.error ||
    recentBookings.error
  ) {
    console.error("getAdminDashboardStats error:", {
      usersError: usersCount.error,
      creatorsError: creatorsCount.error,
      offeringsError: offeringsCount.error,
      bookingAggError: bookingAgg.error,
      reportsError: reportsCount.error,
      recentBookingsError: recentBookings.error,
    });
    return { ok: false };
  }

  const bookingCounts: BookingStatusCounts = {
    pending: 0,
    accepted: 0,
    declined: 0,
    completed: 0,
    total: bookingAgg.data.length,
  };
  const gameCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();

  for (const row of bookingAgg.data) {
    bookingCounts[row.status] += 1;

    const gameName = row.creator_game?.game?.name;
    if (gameName) {
      gameCounts.set(gameName, (gameCounts.get(gameName) ?? 0) + 1);
    }

    const categoryName = row.category?.name;
    if (categoryName) {
      categoryCounts.set(categoryName, (categoryCounts.get(categoryName) ?? 0) + 1);
    }
  }

  const settledCount = bookingCounts.accepted + bookingCounts.declined;
  const approvalRate =
    settledCount === 0 ? null : bookingCounts.accepted / settledCount;

  return {
    ok: true,
    data: {
      totalUsers: usersCount.count ?? 0,
      totalCreators: creatorsCount.count ?? 0,
      totalOfferings: offeringsCount.count ?? 0,
      bookingCounts,
      approvalRate,
      totalReports: reportsCount.count ?? 0,
      popularGames: rankBy(gameCounts),
      popularCategories: rankBy(categoryCounts),
      recentBookings: recentBookings.data.map((row) => ({
        id: row.id,
        requesterName: row.requester?.display_name ?? "不明なPlayer",
        creatorName: row.creator?.display_name ?? "不明なCreator",
        gameName: row.creator_game?.game?.name ?? "不明なゲーム",
        categoryName: row.category?.name ?? "-",
        status: row.status,
        createdAt: row.created_at,
      })),
    },
  };
}
