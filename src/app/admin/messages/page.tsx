import Link from "next/link";
import { Badge, Card, QueryErrorNotice } from "@/components/ui";
import { AdminMessageComposer } from "@/components/admin/AdminMessageComposer";
import { getAdminMessageThreads, getUserOptions } from "@/lib/queries/adminMessages";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminMessagesPage() {
  const [threadsResult, usersResult] = await Promise.all([
    getAdminMessageThreads(),
    getUserOptions(),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
        ← 運営ダッシュボード
      </Link>
      <h1 className="mt-2 text-xl font-medium text-gray-900 sm:text-2xl">
        運営からのメッセージ
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        ユーザーへ個別・一斉にメッセージを送信できます。
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-gray-900">新規メッセージ</h2>
        <Card className="mt-3">
          {!usersResult.ok ? (
            <QueryErrorNotice />
          ) : (
            <AdminMessageComposer mode="picker" users={usersResult.data} />
          )}
        </Card>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-gray-900">送受信履歴</h2>
        {!threadsResult.ok ? (
          <QueryErrorNotice className="mt-3" />
        ) : threadsResult.data.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">まだメッセージはありません。</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {threadsResult.data.map((thread) => (
              <Link key={thread.userId} href={`/admin/messages/${thread.userId}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        {thread.displayName}
                        {thread.isCreator && <Badge variant="brand">Creator</Badge>}
                      </p>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        {thread.lastMessageSenderIsAdmin ? "運営: " : "ユーザー: "}
                        {thread.lastMessageBody}
                      </p>
                    </div>
                    {thread.unreadFromUserCount > 0 && (
                      <Badge variant="danger">未読{thread.unreadFromUserCount}</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    {formatDateTime(thread.lastMessageAt)}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
