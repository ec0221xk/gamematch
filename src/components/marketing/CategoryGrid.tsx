import Link from "next/link";

const categories = [
  {
    slug: "play_together",
    name: "一緒に遊ぶ",
    description: "ゲーム仲間やお気に入りのCreatorとプレイ",
    gradient: "from-indigo-50 to-purple-50",
    iconBg: "from-indigo-100 to-indigo-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <rect x="2" y="7" width="20" height="13" rx="4"/>
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="8" y1="12" x2="8" y2="16"/>
        <line x1="6" y1="14" x2="10" y2="14"/>
        <circle cx="16" cy="13" r="1" fill="#4F46E5" stroke="none"/>
        <circle cx="16" cy="15" r="1" fill="#4F46E5" stroke="none"/>
      </svg>
    ),
  },
  {
    slug: "coaching",
    name: "コーチング",
    description: "上級者から学んで上達",
    gradient: "from-violet-50 to-purple-50",
    iconBg: "from-violet-100 to-violet-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    slug: "rank_up",
    name: "ランクアップ支援",
    description: "目標ランク達成をサポート",
    gradient: "from-purple-50 to-pink-50",
    iconBg: "from-purple-100 to-purple-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
  {
    slug: "vtuber",
    name: "VTuber交流",
    description: "お気に入りのVTuberと特別な時間を過ごす",
    gradient: "from-indigo-50 to-blue-50",
    iconBg: "from-indigo-100 to-blue-100",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2"/>
      </svg>
    ),
  },
];

export function CategoryGrid() {
  return (
    <section className="px-6 py-16 sm:py-20" style={{ background: "linear-gradient(180deg, #fafbff 0%, #f3f4ff 100%)" }}>
      <div className="mx-auto max-w-5xl">
        <h2
          className="text-center font-semibold text-gray-900"
          style={{ fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)", letterSpacing: "-0.02em" }}
        >
          カテゴリから探す
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/creators?category=${category.slug}`}
              className={`category-card group flex flex-col gap-4 rounded-2xl border border-white bg-gradient-to-br ${category.gradient} p-6`}
              style={{
                boxShadow: "0 1px 4px rgba(99,102,241,0.06), 0 0 0 1px rgba(99,102,241,0.06)",
              }}
            >
              {/* アイコン: 大きめ・グラデーション背景 */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.iconBg}`}
              >
                {category.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900" style={{ fontSize: "15px" }}>
                  {category.name}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
