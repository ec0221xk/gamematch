import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageThread } from "@/components/dashboard/MessageThread";
import { QueryErrorNotice } from "@/components/ui";
import {
  getMyMessageThread,
  markAdminMessagesReadByUser,
} from "@/lib/queries/messages";

export default async function MessagesDashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard/messages");
  }

  // ページを開いた時点で、運営からの未読メッセージをまとめて既読にする
  await markAdminMessagesReadByUser(user.id);

  const threadResult = await getMyMessageThread(user.id);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">
        運営からのお知らせ
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        運営からの連絡を確認し、返信できます。
      </p>

      {!threadResult.ok ? (
        <QueryErrorNotice className="mt-8" />
      ) : (
        <div className="mt-8">
          <MessageThread userId={user.id} messages={threadResult.data} />
        </div>
      )}
    </main>
  );
}
