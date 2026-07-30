import Link from "next/link";
import { Avatar, Badge, Card } from "@/components/ui";
import type { CreatorCardData } from "@/lib/queries/creators";
import { getCreatorTagLabel } from "@/lib/constants/creatorTags";

interface CreatorCardProps {
  data: CreatorCardData;
}

/**
 * Creator一覧・TOPページで使う共通カード。
 * 料金の単位は仮で「/ 1回」としている(MVPでは決済を行わないため最終的な単位は要相談)。
 */
export function CreatorCard({ data }: CreatorCardProps) {
  return (
    <Link href={`/creators/${data.creatorId}`} className="block h-full">
      <Card className="flex h-full flex-col gap-4 transition-shadow hover:shadow-md">
        <div className="flex items-center gap-3">
          <Avatar src={data.avatarUrl} alt={data.displayName} />
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900">
              {data.displayName}
            </p>
            <p className="truncate text-sm text-gray-500">{data.gameName}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">{data.categoryName}</Badge>
          {data.rank && <Badge variant="outline">ランク：{data.rank}</Badge>}
        </div>
        {data.featureTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {data.featureTags.slice(0, 3).map((slug) => (
              <Badge key={slug}>{getCreatorTagLabel(slug)}</Badge>
            ))}
          </div>
        )}
        <p className="mt-auto text-sm font-medium text-gray-900">
          ¥{data.price.toLocaleString()}
          <span className="ml-1 text-gray-400">/ {data.unit}</span>
        </p>
      </Card>
    </Link>
  );
}
