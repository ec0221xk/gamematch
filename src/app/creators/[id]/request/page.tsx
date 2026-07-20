import { notFound } from "next/navigation";
import { BookingForm } from "@/components/bookings/BookingForm";
import { Avatar, Badge, Card } from "@/components/ui";
import { getOfferingDetail } from "@/lib/queries/offerings";

interface RequestPageProps {
  params: { id: string };
  searchParams: { offering?: string };
}

const FLOW_STEPS = [
  {
    num: "01",
    title: "申込む",
    desc: "登録・申込はすべて無料です",
  },
  {
    num: "02",
    title: "Creatorが承認",
    desc: "通常24時間以内に返答があります",
  },
  {
    num: "03",
    title: "オンラインで合流してプレイ開始",
    desc: "ボイスチャット・テキストアプリで待ち合わせ。初めての方も安心のサポートあり",
  },
];

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
      <h1 className="text-xl font-semibold text-gray-900">申込フォーム</h1>
      <p className="mt-1 text-sm text-gray-500">
        内容を確認のうえ送信してください。
      </p>

      {/* 申込後の流れ */}
      <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-400">
          申込後の流れ
        </p>
        <div className="flex items-start gap-0">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.num} className="flex flex-1 items-start">
              <div className="flex flex-col items-center text-center flex-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {step.num}
                </div>
                <p className="mt-2 text-xs font-semibold text-indigo-800">{step.title}</p>
                <p className="mt-0.5 text-[11px] text-indigo-500 leading-tight">{step.desc}</p>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className="mt-4 flex-shrink-0 text-indigo-300 text-sm px-1">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Creatorカード */}
      <Card className="mt-5">
        <div className="flex items-center gap-3">
          <Avatar src={offering.creatorAvatarUrl} alt={offering.creatorName} />
          <div>
            <p className="font-semibold text-gray-900">{offering.creatorName}</p>
            <p className="text-sm text-gray-500">{offering.gameName}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="brand">{offering.categoryName}</Badge>
          {offering.rank && <Badge variant="outline">ランク：{offering.rank}</Badge>}
        </div>
        <p className="mt-3 text-sm font-semibold text-gray-900">
          ¥{offering.price.toLocaleString()}
          <span className="ml-1 font-normal text-gray-400">/ {offering.unit}</span>
        </p>
      </Card>

      <div className="mt-5">
        <BookingForm offering={offering} />
      </div>
    </main>
  );
}
