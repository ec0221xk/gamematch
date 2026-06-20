"use client";

import Link from "next/link";

const GAME_TABS = [
  { label: "すべて", slug: "", dot: "" },
  { label: "Apex Legends", slug: "apex-legends", dot: "bg-red-400" },
  { label: "VALORANT", slug: "valorant", dot: "bg-rose-400" },
  { label: "League of Legends", slug: "league-of-legends", dot: "bg-blue-400" },
  { label: "Fortnite", slug: "fortnite", dot: "bg-purple-400" },
  { label: "原神", slug: "genshin-impact", dot: "bg-amber-400" },
  { label: "Minecraft", slug: "minecraft", dot: "bg-green-400" },
];

const CATEGORY_TABS = [
  { label: "すべて", slug: "" },
  { label: "一緒に遊ぶ", slug: "play_together" },
  { label: "コーチング", slug: "coaching" },
  { label: "ランクアップ支援", slug: "rank_up" },
  { label: "VTuber交流", slug: "vtuber" },
];

interface FilterTabsProps {
  selectedGame?: string;
  selectedCategory?: string;
}

/**
 * ゲームとカテゴリの2段タブ。
 * 選択するとCreator一覧(/creators)にフィルター付きで遷移する。
 * 既存のSupabaseクエリをそのまま流用できる設計。
 * Sticky固定はしない(モバイルで画面を圧迫するため)。
 */
export function FilterTabs({ selectedGame = "", selectedCategory = "" }: FilterTabsProps) {
  const buildHref = (game: string, category: string) => {
    const params = new URLSearchParams();
    if (game) params.set("game", game);
    if (category) params.set("category", category);
    const qs = params.toString();
    return `/creators${qs ? `?${qs}` : ""}`;
  };

  return (
    <section className="border-b border-gray-100 bg-white px-6 py-4">
      <div className="mx-auto max-w-5xl space-y-3">
        {/* ゲームタブ */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {GAME_TABS.map((tab) => {
            const active = tab.slug === selectedGame;
            return (
              <Link
                key={tab.slug}
                href={buildHref(tab.slug, selectedCategory)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.dot && (
                  <span className={`h-2 w-2 rounded-full ${tab.dot}`} />
                )}
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* カテゴリタブ */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORY_TABS.map((tab) => {
            const active = tab.slug === selectedCategory;
            return (
              <Link
                key={tab.slug}
                href={buildHref(selectedGame, tab.slug)}
                className={`flex shrink-0 items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
