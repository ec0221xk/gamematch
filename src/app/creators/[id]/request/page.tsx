import { notFound } from "next/navigation";
import { BookingForm } from "@/components/bookings/BookingForm";
import { Avatar, Badge, Card } from "@/components/ui";
import { getOfferingDetail } from "@/lib/queries/offerings";

interface RequestPageProps {
  params: { id: string };
  searchParams: { offering?: string };
}

export default async function RequestPage({
  params,
  searchParams,
}: RequestPageProps) {
  if (!searchParams.offering) {
    notFound();
  }

  const offering = await getOfferingDetail(searchParams.offering);

  if (!offering || offering.creatorId !== params.id) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-12">
      <h1 className="text-xl font-medium text-gray-900">申込フォーム</h1>
      <p className="mt-1 text-sm text-gray-500">
        内容を確認のうえ送信してください。
      </p>

      <Card className="mt-6">
        <div className="flex items-center gap-3">
          <Avatar src={offering.creatorAvatarUrl} alt={offering.creatorName} />
          <div>
            <p className="font-medium text-gray-900">{offering.creatorName}</p>
            <p className="text-sm text-gray-500">{offering.gameName}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="brand">{offering.categoryName}</Badge>
          {offering.rank && <Badge variant="outline">{offering.rank}</Badge>}
        </div>
        <p className="mt-3 text-sm font-medium text-gray-900">
          ¥{offering.price.toLocaleString()}
          <span className="ml-1 text-gray-400">/ 1回</span>
        </p>
      </Card>

      <div className="mt-6">
        <BookingForm offering={offering} />
      </div>
    </main>
  );
}
