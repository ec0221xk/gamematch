import { notFound } from "next/navigation";
import { Avatar, Badge, ButtonLink, Card } from "@/components/ui";
import { getCreatorProfile } from "@/lib/queries/creatorProfile";

interface CreatorDetailPageProps {
  params: { id: string };
}

export default async function CreatorDetailPage({
  params,
}: CreatorDetailPageProps) {
  const creator = await getCreatorProfile(params.id);

  if (!creator) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-start gap-4">
        <Avatar src={creator.avatarUrl} alt={creator.displayName} size="lg" />
        <div>
          <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">
            {creator.displayName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
            <span>実績 {creator.completedCount}件</span>
            {creator.country && <span>{creator.country}</span>}
            {creator.languages.length > 0 && (
              <span>{creator.languages.join(" / ")}</span>
            )}
          </div>
          {creator.discordId && (
            <p className="mt-1 text-sm text-gray-500">
              Discord: {creator.discordId}
            </p>
          )}
        </div>
      </div>

      {creator.bio && (
        <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
          {creator.bio}
        </p>
      )}

      <h2 className="mt-10 text-base font-medium text-gray-900">
        提供しているサービス
      </h2>

      {creator.offerings.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3">
          {creator.offerings.map((offering) => (
            <Card
              key={offering.id}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {offering.gameName}
                  </span>
                  <Badge variant="brand">{offering.categoryName}</Badge>
                  {offering.rank && (
                    <Badge variant="outline">ランク：{offering.rank}</Badge>
                  )}
                </div>
                {offering.description && (
                  <p className="mt-2 text-sm text-gray-500">
                    {offering.description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
                <p className="text-sm font-medium text-gray-900">
                  ¥{offering.price.toLocaleString()}
                  <span className="ml-1 text-gray-400">/ 1回</span>
                </p>
                <ButtonLink
                  href={`/creators/${creator.id}/request?offering=${offering.id}`}
                  size="sm"
                >
                  申込する
                </ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-center">
          <p className="text-sm text-gray-500">
            現在提供中のサービスはありません。
          </p>
        </div>
      )}
    </main>
  );
}
