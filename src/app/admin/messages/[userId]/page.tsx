import Link from "next/link";
import { Badge, Card, QueryErrorNotice } from "@/components/ui";
import { AdminMessageComposer } from "@/components/admin/AdminMessageComposer";
import {
  getAdminMessageThread,
  markUserMessagesReadByAdmin,
} from "@/lib/queries/adminMessages";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface AdminMessageThreadPageProps {
  params: { userId: string };
}

export default async function AdminMessageThreadPage({
  params,
}: AdminMessageThreadPageProps) {
  const threadResult = await getAdminMessageThread(params.userId);

  if (!threadResult.ok) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <QueryErrorNotice />
      </main>
    );
  }

  // 詳細を開いた時点で、このユーザーからの返信をまとめて既読にする
  await markUserMessagesReadByAdmin(params.userId);

  const { displayName, isCreator, messages } = threadResult.data;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/admin/messages"
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        ← メッセージ一覧
      </Link>
      <div className="mt-2 flex items-center gap-2">
        <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">
          {displayName}
        </h1>
        {isCreator && <Badge variant="brand">Creator</Badge>}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">まだメッセージはありません。</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                message.senderIsAdmin
                  ? "self-end bg-brand-50 text-brand-900"
                  : "self-start bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-xs text-gray-400">
                {message.senderIsAdmin ? "運営" : displayName}
              </p>
              <p className="mt-0.5 whitespace-pre-wrap">{message.body}</p>
              <p className="mt-1 text-xs text-gray-400">
                {formatDateTime(message.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>

      <Card className="mt-6">
        <AdminMessageComposer mode="single" fixedUserId={params.userId} />
      </Card>
    </main>
  );
}
