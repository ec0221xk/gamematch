import Link from "next/link";

const pillars = [
  {
    title: "推し活",
    description: "一緒に遊ぶ・雑談・VTuber交流",
    gradient: "from-indigo-50 to-purple-50",
    iconBg: "from-indigo-100 to-indigo-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    title: "コーチング",
    description: "ランクアップ・立ち回り指導・初心者歓迎",
    gradient: "from-violet-50 to-purple-50",
    iconBg: "from-violet-100 to-violet-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
];

/**
 * サービスの2本柱(推し活/コーチング)を訴求するセクション。
 * カテゴリ絞り込みは単位問題と同様、まだ確実に対応付けできないため
 * リンク先はどちらも/creators(絞り込みなし)に留める。
 */
export function TwoPillars() {
  return (
    <section className="px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-4 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <Link
              key={pillar.title}
              href="/creators"
              className={`group flex flex-col gap-4 rounded-2xl border border-white bg-gradient-to-br ${pillar.gradient} p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
              style={{
                boxShadow: "0 1px 4px rgba(99,102,241,0.06), 0 0 0 1px rgba(99,102,241,0.06)",
              }}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.iconBg}`}
              >
                {pillar.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900" style={{ fontSize: "17px" }}>
                  {pillar.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                  {pillar.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
