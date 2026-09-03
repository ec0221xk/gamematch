import Link from "next/link";
import { Badge, Card, QueryErrorNotice } from "@/components/ui";
import { StatCard } from "@/components/admin/StatCard";
import { getAdminDashboardStats } from "@/lib/queries/admin";
import { getUnreadReplyCount } from "@/lib/queries/adminMessages";
import type { BookingStatus } from "@/lib/types/database";

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "申込中",
  accepted: "承認済み",
  declined: "辞退済み",
  completed: "完了",
};

const STATUS_VARIANT: Record<
  BookingStatus,
  "default" | "brand" | "outline" | "danger"
> = {
  pending: "outline",
  accepted: "brand",
  declined: "danger",
  completed: "default",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatPercent(rate: number | null) {
  return rate === null ? "-" : `${Math.round(rate * 100)}%`;
}

export default async function AdminDashboardPage() {
  const [statsResult, unreadReplyResult] = await Promise.all([
    getAdminDashboardStats(),
    getUnreadReplyCount(),
  ]);

  if (!statsResult.ok) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">
          運営ダッシュボード
        </h1>
        <QueryErrorNotice className="mt-8" />
      </main>
    );
  }

  const stats = statsResult.data;
  const unreadReplyCount = unreadReplyResult.ok ? unreadReplyResult.data : 0;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">
        運営ダッシュボード
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        サービス全体の利用状況を確認できます。
      </p>

      <section className="mt-8">
        <Link href="/admin/messages">
          <Card className="flex items-center justify-between gap-3 transition-shadow hover:shadow-md">
            <div>
              <h2 className="text-sm font-medium text-gray-900">
                運営からのメッセージ
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                ユーザーへ連絡したり、返信を確認できます。
              </p>
            </div>
            {unreadReplyCount > 0 && (
              <Badge variant="danger">未読{unreadReplyCount}</Badge>
            )}
          </Card>
        </Link>
      </section>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="登録ユーザー総数" value={stats.totalUsers.toLocaleString()} />
        <StatCard label="Creator数" value={stats.totalCreators.toLocaleString()} />
        <StatCard label="出品総数" value={stats.totalOfferings.toLocaleString()} />
        <StatCard label="通報件数" value={stats.totalReports.toLocaleString()} />
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-gray-900">申込状況</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="申込総数" value={stats.bookingCounts.total.toLocaleString()} />
          <StatCard label="申込中" value={stats.bookingCounts.pending.toLocaleString()} />
          <StatCard label="承認済み" value={stats.bookingCounts.accepted.toLocaleString()} />
          <StatCard label="辞退済み" value={stats.bookingCounts.declined.toLocaleString()} />
          <StatCard label="承認率" value={formatPercent(stats.approvalRate)} />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          承認率は「承認済み ÷ (承認済み + 辞退済み)」で算出しています(申込中は含みません)。
        </p>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium text-gray-900">人気のゲーム</h2>
          <Card className="mt-3">
            {stats.popularGames.length === 0 ? (
              <p className="text-sm text-gray-500">まだ申込がありません。</p>
            ) : (
              <ol className="space-y-2">
                {stats.popularGames.map((entry, index) => (
                  <li
                    key={entry.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700">
                      {index + 1}. {entry.name}
                    </span>
                    <span className="text-gray-500">{entry.count}件</span>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-900">人気のカテゴリ</h2>
          <Card className="mt-3">
            {stats.popularCategories.length === 0 ? (
              <p className="text-sm text-gray-500">まだ申込がありません。</p>
            ) : (
              <ol className="space-y-2">
                {stats.popularCategories.map((entry, index) => (
                  <li
                    key={entry.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700">
                      {index + 1}. {entry.name}
                    </span>
                    <span className="text-gray-500">{entry.count}件</span>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-gray-900">最近の申込</h2>
        {stats.recentBookings.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">まだ申込がありません。</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {stats.recentBookings.map((booking) => (
              <Card key={booking.id}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-gray-700">
                    {booking.requesterName} → {booking.creatorName}
                  </p>
                  <Badge variant={STATUS_VARIANT[booking.status]}>
                    {STATUS_LABEL[booking.status]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {booking.gameName} ・ {booking.categoryName}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  {formatDateTime(booking.createdAt)}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
