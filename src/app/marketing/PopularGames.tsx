import Link from "next/link";

const games = [
  { name: "Apex Legends", slug: "apex-legends", color: "bg-red-50 text-red-700 border-red-200" },
  { name: "VALORANT", slug: "valorant", color: "bg-rose-50 text-rose-700 border-rose-200" },
  { name: "League of Legends", slug: "league-of-legends", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Fortnite", slug: "fortnite", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { name: "原神", slug: "genshin-impact", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Minecraft", slug: "minecraft", color: "bg-green-50 text-green-700 border-green-200" },
];

/**
 * 人気ゲーム一覧の横スクロールセクション。
 * 「自分のゲームがある」という安心感と、サービスの具体性を伝える。
 */
export function PopularGames() {
  return (
    <section className="border-y border-gray-100 bg-white px-6 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-4">
          <p className="shrink-0 text-xs font-medium text-gray-400">人気のゲーム</p>
          {/* 横スクロール */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {games.map((game) => (
              <Link
                key={game.slug}
                href={`/creators?game=${game.slug}`}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80 ${game.color}`}
              >
                {game.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
