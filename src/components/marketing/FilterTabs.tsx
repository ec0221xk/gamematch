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

interface FilterTabsProps {
  selectedGame?: string;
}

/**
 * ゲーム別の絞り込みタブ。
 * カテゴリの大分類はTwoPillars(推し活/コーチング)が入口ボタンとして担うため、
 * ここはゲーム別の絞り込みに専念する(役割重複の解消)。
 * 選択すると/creatorsにフィルター付きで遷移する。
 * Sticky固定はしない(モバイルで画面を圧迫するため)。
 */
export function FilterTabs({ selectedGame = "" }: FilterTabsProps) {
  const buildHref = (game: string) => {
    const params = new URLSearchParams();
    if (game) params.set("game", game);
    const qs = params.toString();
    return `/creators${qs ? `?${qs}` : ""}`;
  };

  return (
    <section className="border-b border-gray-100 bg-white px-6 py-5">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-xs font-medium text-gray-400">ゲームで探す</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {GAME_TABS.map((tab) => {
            const active = tab.slug === selectedGame;
            return (
              <Link
                key={tab.slug}
                href={buildHref(tab.slug)}
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
      </div>
    </section>
  );
}
