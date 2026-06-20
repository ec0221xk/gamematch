import Link from "next/link";

/**
 * 人気ゲーム一覧。
 * 各ゲームのカラーイメージをバッジで表現し、ゲームサービスらしい世界観を演出する。
 * 実際のロゴ画像は著作権の都合で使用せず、ゲームカラーに寄せたテキストバッジを採用。
 */
const games = [
  {
    name: "Apex Legends",
    slug: "apex-legends",
    // Apexのコーポレートカラー: 赤系
    style: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
    dot: "bg-red-400",
  },
  {
    name: "VALORANT",
    slug: "valorant",
    // VALORANTのカラー: ローズレッド
    style: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
    dot: "bg-rose-400",
  },
  {
    name: "League of Legends",
    slug: "league-of-legends",
    // LoLのカラー: ゴールド/ブルー → ここではブルー系
    style: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
    dot: "bg-blue-400",
  },
  {
    name: "Fortnite",
    slug: "fortnite",
    // フォートナイト: パープル
    style: "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100",
    dot: "bg-purple-400",
  },
  {
    name: "原神",
    slug: "genshin-impact",
    // 原神: アンバー/ゴールド
    style: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
    dot: "bg-amber-400",
  },
  {
    name: "Minecraft",
    slug: "minecraft",
    // マイクラ: グリーン
    style: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
    dot: "bg-green-400",
  },
];

export function PopularGames() {
  return (
    <section className="bg-gray-50 px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-gray-400">
          対応ゲーム
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/creators?game=${game.slug}`}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${game.style}`}
            >
              {/* ゲームカラードット */}
              <span className={`h-2 w-2 shrink-0 rounded-full ${game.dot}`} />
              {game.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
