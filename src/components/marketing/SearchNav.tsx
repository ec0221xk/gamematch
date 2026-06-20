import Link from "next/link";

const options = [
  {
    href: "/creators",
    title: "Creatorから探す",
    description: "名前やゲームでCreatorを検索",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    gradient: "from-indigo-500 to-indigo-600",
    bg: "from-indigo-50 to-indigo-100/60",
    border: "border-indigo-100",
    textColor: "text-indigo-700",
  },
  {
    href: "/creators",
    title: "ゲームから探す",
    description: "遊びたいタイトルでCreatorを絞り込む",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <rect x="2" y="7" width="20" height="13" rx="4"/>
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="8" y1="12" x2="8" y2="16"/>
        <line x1="6" y1="14" x2="10" y2="14"/>
        <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none"/>
        <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
    gradient: "from-violet-500 to-purple-600",
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-100",
    textColor: "text-violet-700",
  },
  {
    href: "/creators",
    title: "カテゴリから探す",
    description: "一緒に遊ぶ・コーチング・VTuber交流など",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    gradient: "from-purple-500 to-pink-500",
    bg: "from-purple-50 to-pink-50",
    border: "border-purple-100",
    textColor: "text-purple-700",
  },
];

/**
 * Creator・ゲーム・カテゴリの3つの探し方を並列表示。
 * ユーザーが自分の探し方を選べる導線。
 */
export function SearchNav() {
  return (
    <section className="px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-center text-sm font-medium text-gray-400">
          あなたの探し方で見つける
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {options.map((option) => (
            <Link
              key={option.title}
              href={option.href}
              className={`group flex items-start gap-4 rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${option.bg} ${option.border}`}
              style={{ boxShadow: "0 1px 3px rgba(99,102,241,0.07)" }}
            >
              {/* アイコン */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${option.gradient}`}
                style={{ boxShadow: "0 4px 10px rgba(99,102,241,0.25)" }}
              >
                {option.icon}
              </div>
              {/* テキスト */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${option.textColor}`} style={{ fontSize: "15px" }}>
                  {option.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {option.description}
                </p>
              </div>
              {/* 矢印 */}
              <svg
                className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${option.textColor}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
