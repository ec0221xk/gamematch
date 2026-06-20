import Link from "next/link";
import { Avatar, Badge, Card, ButtonLink } from "@/components/ui";
import type { CreatorCardData } from "@/lib/queries/creators";

// DBが空の間に表示するサンプルデータ。
// 実際のCreatorが登録されるとDBのデータに置き換わる。
const SAMPLE_CREATORS: (CreatorCardData & { bio: string })[] = [
  {
    id: "sample-1", creatorId: "sample-1",
    displayName: "あおい", avatarUrl: null,
    gameName: "Apex Legends", rank: "マスター",
    price: 1500, categoryName: "一緒に遊ぶ",
    bio: "ランクマをフレンドリーに一緒に回ります。初心者歓迎！",
  },
  {
    id: "sample-2", creatorId: "sample-2",
    displayName: "ゆうき", avatarUrl: null,
    gameName: "VALORANT", rank: "イモータル",
    price: 2000, categoryName: "コーチング",
    bio: "エイム・立ち回りを丁寧に解説。伸び悩んでいる方にオススメ。",
  },
  {
    id: "sample-3", creatorId: "sample-3",
    displayName: "みお🌸", avatarUrl: null,
    gameName: "League of Legends", rank: "ダイヤ",
    price: 1800, categoryName: "ランクアップ支援",
    bio: "目標ランクまで最短ルートで伴走します。一緒に上を目指しましょう！",
  },
  {
    id: "sample-4", creatorId: "sample-4",
    displayName: "さくらVTuber", avatarUrl: null,
    gameName: "原神", rank: null,
    price: 1200, categoryName: "VTuber交流",
    bio: "配信でおなじみのさくらです。一緒に原神を探索しましょう✨",
  },
  {
    id: "sample-5", creatorId: "sample-5",
    displayName: "けんと", avatarUrl: null,
    gameName: "Fortnite", rank: "チャンピオン",
    price: 1000, categoryName: "一緒に遊ぶ",
    bio: "ビクロイ量産型です。カジュアルにガチに、どちらも対応。",
  },
  {
    id: "sample-6", creatorId: "sample-6",
    displayName: "なな", avatarUrl: null,
    gameName: "Minecraft", rank: null,
    price: 800, categoryName: "コーチング",
    bio: "建築・レッドストーン専門。初めての方でも優しく教えます🏠",
  },
];

interface FeaturedCreatorsProps {
  creators: CreatorCardData[];
}

export function FeaturedCreators({ creators }: FeaturedCreatorsProps) {
  const isReal = creators.length > 0;
  const displayCreators = isReal ? creators : SAMPLE_CREATORS;

  return (
    <section className="px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-medium text-gray-900 sm:text-2xl">
              Creatorを探す
            </h2>
            {!isReal && (
              <p className="mt-1 text-xs text-gray-400">※ サンプル表示です</p>
            )}
          </div>
          <Link
            href="/creators"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            すべて見る →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayCreators.map((creator) => {
            const sample = creator as typeof SAMPLE_CREATORS[0];
            return (
              <Card
                key={creator.id}
                className="flex flex-col gap-3 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={creator.avatarUrl} alt={creator.displayName} size="md" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {creator.displayName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {creator.gameName}
                    </p>
                  </div>
                </div>

                {sample.bio && (
                  <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {sample.bio}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="brand">{creator.categoryName}</Badge>
                  {creator.rank && (
                    <Badge variant="outline">{creator.rank}</Badge>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    ¥{creator.price.toLocaleString()}
                    <span className="ml-1 text-xs text-gray-400">/ 1回</span>
                  </p>
                  <ButtonLink
                    href={isReal ? `/creators/${creator.creatorId}` : "/signup"}
                    size="sm"
                    variant="outline"
                  >
                    詳細を見る
                  </ButtonLink>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
