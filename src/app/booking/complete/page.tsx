import { ButtonLink } from "@/components/ui";

interface BookingCompletePageProps {
  searchParams: { creator?: string };
}

export default function BookingCompletePage({
  searchParams,
}: BookingCompletePageProps) {
  return (
    <main className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-xl font-medium text-gray-900">
        送信が完了しました
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">
        {searchParams.creator
          ? `${searchParams.creator}さんへの申込を送信しました。`
          : "申込を送信しました。"}
        <br />
        Creatorからの連絡をお待ちください。
      </p>
      <div className="mt-8 flex justify-center">
        <ButtonLink href="/creators" variant="outline" size="sm">
          Creator一覧へ戻る
        </ButtonLink>
      </div>
    </main>
  );
}
