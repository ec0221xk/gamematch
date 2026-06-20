import Link from "next/link";

const categories = [
  {
    slug: "play_together",
    name: "一緒に遊ぶ",
    description: "ゲーム仲間やお気に入りのCreatorとプレイ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="2" y="7" width="20" height="13" rx="4" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="8" y1="12" x2="8" y2="16" />
        <line x1="6" y1="14" x2="10" y2="14" />
        <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" />
        <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    slug: "coaching",
    name: "コーチング",
    description: "上級者から学んで上達",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    slug: "rank_up",
    name: "ランクアップ支援",
    description: "目標ランク達成をサポート",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    slug: "vtuber",
    name: "VTuber交流",
    description: "お気に入りのVTuberと特別な時間を過ごす",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
  },
];

/**
 * カテゴリ4種。アイコン付きカードで一目で何ができるか伝える。
 * クリックするとCreator一覧をカテゴリで絞り込んだ状態で遷移する。
 */
export function CategoryGrid() {
  return (
    <section className="bg-gray-50 px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-xl font-medium text-gray-900 sm:text-2xl">
          カテゴリから探す
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/creators?category=${category.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
                {category.icon}
              </div>
              <div>
                <p className="font-medium text-gray-900">{category.name}</p>
                <p className="mt-1 text-sm text-gray-500">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
