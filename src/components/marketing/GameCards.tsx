import Link from "next/link";

const GAMES = [
  { name: "Apex Legends", slug: "apex-legends", gradient: "from-red-50 to-orange-50", accent: "#EF4444" },
  { name: "VALORANT", slug: "valorant", gradient: "from-rose-50 to-red-50", accent: "#F43F5E" },
  { name: "League of Legends", slug: "league-of-legends", gradient: "from-blue-50 to-sky-50", accent: "#3B82F6" },
  { name: "Fortnite", slug: "fortnite", gradient: "from-purple-50 to-fuchsia-50", accent: "#A855F7" },
  { name: "原神", slug: "genshin-impact", gradient: "from-amber-50 to-yellow-50", accent: "#F59E0B" },
  { name: "Minecraft", slug: "minecraft", gradient: "from-green-50 to-emerald-50", accent: "#22C55E" },
];

/**
 * ゲーム別の絞り込み導線。押すと/creatorsにgameフィルター付きで遷移する。
 * ロゴ画像は使えないため、TwoPillarsと同じ抽象グラフィック(色付きblob)の手法で
 * ゲームごとの世界観を表現する。Creator数は実データが無いため「募集中」で代替。
 */
export function GameCards() {
  return (
    <section className="border-b border-gray-100 bg-white px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <p className="mb-5 text-xs font-medium uppercase tracking-widest text-gray-400">
          ゲームから探す
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {GAMES.map((game) => (
            <Link
              key={game.slug}
              href={`/creators?game=${game.slug}`}
              className={`group relative flex min-h-[104px] flex-col justify-between overflow-hidden rounded-2xl border border-white bg-gradient-to-br p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5 ${game.gradient}`}
              style={{
                boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)",
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="pointer-events-none absolute -right-5 -top-6 h-24 w-24"
              >
                <circle cx="50" cy="50" r="42" fill={game.accent} opacity="0.16" />
                <circle cx="68" cy="28" r="10" fill={game.accent} opacity="0.3" />
              </svg>
              <p className="relative z-10 font-semibold text-gray-900" style={{ fontSize: "15px" }}>
                {game.name}
              </p>
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs text-gray-500">Creator募集中</span>
                <svg
                  className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/creators" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            すべてのCreatorを見る →
          </Link>
        </div>
      </div>
    </section>
  );
}
