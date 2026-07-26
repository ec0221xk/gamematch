import { notFound, redirect } from "next/navigation";
import { ReportForm } from "@/components/reports/ReportForm";
import { Avatar, Card } from "@/components/ui";
import { getCreatorProfile } from "@/lib/queries/creatorProfile";
import { createClient } from "@/lib/supabase/server";

interface ReportPageProps {
  params: { id: string };
}

/**
 * 通報フォーム。BookingFormの/creators/[id]/requestと同じく
 * モーダルではなく専用ページとして実装し、既存の申込フォームと構成を揃えている。
 * middleware.tsで未ログイン時は/loginへリダイレクトされるため、
 * ここに到達する時点で基本的にログイン済みだが、直接URLを叩かれた場合等に備えて
 * サーバー側でも未ログイン・自己通報のガードを行う。
 */
export default async function ReportPage({ params }: ReportPageProps) {
  const creator = await getCreatorProfile(params.id);

  if (!creator) {
    notFound();
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectTo = `/creators/${params.id}/report`;
    redirect(`/login?${new URLSearchParams({ redirectTo }).toString()}`);
  }

  if (user.id === creator.id) {
    redirect(`/creators/${creator.id}`);
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-12">
      <h1 className="text-xl font-semibold text-gray-900">通報する</h1>
      <p className="mt-1 text-sm text-gray-500">
        内容は運営が確認します。通報したことは相手に通知されません。
      </p>

      <Card className="mt-6">
        <div className="flex items-center gap-3">
          <Avatar src={creator.avatarUrl} alt={creator.displayName} />
          <p className="font-semibold text-gray-900">{creator.displayName}</p>
        </div>
      </Card>

      <div className="mt-5">
        <ReportForm reportedUserId={creator.id} />
      </div>
    </main>
  );
}
