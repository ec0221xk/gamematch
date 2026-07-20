import Link from "next/link";
import { Avatar, Badge, ButtonLink } from "@/components/ui";
import type { CreatorCardData } from "@/lib/queries/creators";

interface SampleCreator extends CreatorCardData {
  bio: string;
  tags: string[];
}

// 評価・実績数値を排除。代わりにステータスタグで人柄・環境を示す
const SAMPLE_CREATORS: SampleCreator[] = [
  {
    id: "sample-1", creatorId: "sample-1",
    displayName: "あおい",
    avatarUrl: null,
    gameName: "Apex Legends",
    rank: "マスター",
    price: 1500,
    unit: "1時間",
    categoryName: "一緒に遊ぶ",
    bio: "ランクマをフレンドリーに一緒に回ります。初心者大歓迎！ポジショニングを優しく解説します。",
    tags: ["ボイスチャット対応", "初心者歓迎"],
  },
  {
    id: "sample-2", creatorId: "sample-2",
    displayName: "ゆうき",
    avatarUrl: null,
    gameName: "VALORANT",
    rank: "イモータル",
    price: 2000,
    unit: "90分",
    categoryName: "コーチング",
    bio: "エイム・立ち回りを丁寧に解説。伸び悩んでいる方のランク帯に合わせてカスタマイズします。",
    tags: ["ボイスチャット対応", "丁寧な解説"],
  },
  {
    id: "sample-3", creatorId: "sample-3",
    displayName: "みお🌸",
    avatarUrl: null,
    gameName: "League of Legends",
    rank: "ダイヤ",
    price: 1800,
    unit: "3試合",
    categoryName: "ランクアップ支援",
    bio: "目標ランクまで最短ルートで伴走します。メンタルサポートも大切にしています！",
    tags: ["ボイスチャット対応", "女性Creator"],
  },
];

interface FeaturedCreatorsProps {
  creators: CreatorCardData[];
}

export function FeaturedCreators({ creators }: FeaturedCreatorsProps) {
  const isReal = creators.length > 0;
  const displayCreators: SampleCreator[] = isReal
    ? creators.slice(0, 3).map((c) => ({ ...c, bio: "", tags: ["ボイスチャット対応"] }))
    : SAMPLE_CREATORS;

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-semibold text-gray-900"
              style={{ fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)", letterSpacing: "-0.02em" }}>
              注目のCreator
            </h2>
            {!isReal && (
              <p className="mt-1 text-[10px] text-gray-300">※ サンプル</p>
            )}
          </div>
          <Link href="/creators" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            すべて見る →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {displayCreators.map((creator) => (
            <div key={creator.id} className="creator-card flex flex-col rounded-3xl border border-gray-100 bg-white"
              style={{ padding: "32px", gap: "20px", borderRadius: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

              {/* プロフィール */}
              <div className="flex items-center gap-4">
                <Avatar src={creator.avatarUrl} alt={creator.displayName} size="md" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900" style={{ fontSize: "15px" }}>
                    {creator.displayName}
                  </p>
                  <p className="truncate text-xs text-gray-400 mt-0.5">{creator.gameName}</p>
                </div>
              </div>

              {/* 自己紹介 */}
              {creator.bio && (
                <p className="text-gray-500 leading-relaxed" style={{ fontSize: "13px",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                  {creator.bio}
                </p>
              )}

              {/* カテゴリ・ランクバッジ */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="brand">{creator.categoryName}</Badge>
                {creator.rank && <Badge variant="outline">ランク：{creator.rank}</Badge>}
              </div>

              {/* ステータスタグ(実績数値の代わり) */}
              <div className="flex flex-wrap gap-1.5">
                {creator.tags.map((tag) => (
                  <span key={tag}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                    ✓ {tag}
                  </span>
                ))}
              </div>

              {/* 料金とCTA */}
              <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-4">
                <div>
                  <div>
                    <span className="font-bold text-gray-900" style={{ fontSize: "18px" }}>
                      ¥{creator.price.toLocaleString()}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">/ {creator.unit}</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    ※料金はCreatorとの合意後に確定します
                  </p>
                </div>
                <ButtonLink
                  href={isReal ? `/creators/${creator.creatorId}` : "/signup"}
                  size="sm">
                  申し込む
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
