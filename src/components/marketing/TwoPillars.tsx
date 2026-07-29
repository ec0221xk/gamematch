import Link from "next/link";

const pillars = [
  {
    title: "推し活",
    description: "一緒に遊ぶ・雑談・VTuber交流",
    href: "/creators?category=play_together,vtuber",
    gradient: "from-indigo-50 to-purple-50",
    iconBg: "from-indigo-100 to-indigo-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    // 装飾: ハート・星でやわらかい暖色系の「楽しい・親しみ」の雰囲気
    decoration: (
      <svg aria-hidden="true" viewBox="0 0 160 160" className="pointer-events-none absolute -right-4 -top-6 h-36 w-36 sm:h-44 sm:w-44">
        <defs>
          <linearGradient id="pillarWarmBlob" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#FBCFE8" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="60" r="65" fill="url(#pillarWarmBlob)" opacity="0.45" />
        <path d="M70 95c-13-9-22-16-22-27a13 13 0 0 1 22-9 13 13 0 0 1 22 9c0 11-9 18-22 27z" fill="#FB7185" opacity="0.55" />
        <path d="M120 25l2.5 6.5 6.5 2.5-6.5 2.5-2.5 6.5-2.5-6.5-6.5-2.5 6.5-2.5z" fill="#FBBF24" opacity="0.7" />
        <path d="M35 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#F472B6" opacity="0.5" />
        <circle cx="130" cy="90" r="4" fill="#FDBA74" opacity="0.6" />
        <circle cx="45" cy="92" r="3" fill="#F9A8D4" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "コーチング",
    description: "ランクアップ・立ち回り指導・初心者歓迎",
    href: "/creators?category=coaching,rank_up",
    gradient: "from-violet-50 to-purple-50",
    iconBg: "from-violet-100 to-violet-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    // 装飾: 上昇バー・成長を表す矢印ラインで寒色〜紫系の「上達・成長」の雰囲気
    decoration: (
      <svg aria-hidden="true" viewBox="0 0 160 160" className="pointer-events-none absolute -right-4 -top-6 h-36 w-36 sm:h-44 sm:w-44">
        <defs>
          <linearGradient id="pillarCoolBlob" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C7D2FE" />
            <stop offset="100%" stopColor="#E9D5FF" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="60" r="65" fill="url(#pillarCoolBlob)" opacity="0.45" />
        <rect x="30" y="100" width="16" height="34" rx="4" fill="#A78BFA" opacity="0.5" />
        <rect x="58" y="80" width="16" height="54" rx="4" fill="#8B5CF6" opacity="0.55" />
        <rect x="86" y="55" width="16" height="79" rx="4" fill="#7C3AED" opacity="0.6" />
        <path d="M30 60 L60 35 L86 50 L124 15" stroke="#6D28D9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.55" />
        <path d="M104 13 L126 15 L122 36" stroke="#6D28D9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.55" />
      </svg>
    ),
  },
];

/**
 * サービスの2本柱(推し活/コーチング)を訴求する入口ボタン。
 * カテゴリの大分類はここが担い、下のGameCardsはゲーム別の絞り込みに専念する
 * (役割重複の解消)。押すと/creatorsへカテゴリ絞り込み済みで遷移する。
 */
export function TwoPillars() {
  return (
    <section className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-5 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white bg-gradient-to-br ${pillar.gradient} p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
              style={{
                boxShadow: "0 1px 4px rgba(99,102,241,0.06), 0 0 0 1px rgba(99,102,241,0.06)",
              }}
            >
              {pillar.decoration}
              <div
                className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.iconBg}`}
              >
                {pillar.icon}
              </div>
              <div className="relative z-10">
                <p className="font-semibold text-gray-900" style={{ fontSize: "17px" }}>
                  {pillar.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
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
