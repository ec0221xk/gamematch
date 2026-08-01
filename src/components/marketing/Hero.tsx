import Link from "next/link";
import { HeroIllustration } from "./HeroIllustration";
import { ButtonLink } from "@/components/ui";

// 実績が無くても正直に言える「強み・気軽さ」。安全性の詳細はTrustSectionが担うため、
// ここでは「お得さ・始めやすさ・安心感」に絞る。実データの数字は使わない。
const heroPoints = [
  { icon: "💰", text: "手数料0円／売上は全額Creatorのもの" },
  { icon: "🔒", text: "承認するまで連絡先は非公開／で安心" },
  { icon: "⚡", text: "登録は無料／数分で完了" },
];

// slugはcategoriesテーブル(0001_init.sql)のものと一致させる。
// 表示順は「一緒に遊ぶ／コーチング／VTuber交流／ランクアップ支援」。
const categories = [
  {
    title: "一緒に遊ぶ",
    desc: "気の合うCreatorと一緒にプレイ",
    slug: "play_together",
    gradient: "from-indigo-50 to-blue-50",
    accent: "#4F46E5",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="2" y="7" width="20" height="13" rx="4" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="8" y1="12" x2="8" y2="16" />
        <line x1="6" y1="14" x2="10" y2="14" />
        <circle cx="16" cy="13" r="1" fill="#4F46E5" stroke="none" />
        <circle cx="16" cy="15" r="1" fill="#4F46E5" stroke="none" />
      </svg>
    ),
  },
  {
    title: "コーチング",
    desc: "上級者から学んで上達",
    slug: "coaching",
    gradient: "from-violet-50 to-purple-50",
    accent: "#7C3AED",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    title: "VTuber交流",
    desc: "お気に入りのVTuberと特別な時間を",
    slug: "vtuber",
    gradient: "from-fuchsia-50 to-pink-50",
    accent: "#C026D3",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
  },
  {
    title: "ランクアップ支援",
    desc: "目標ランク達成をサポート",
    slug: "rank_up",
    gradient: "from-sky-50 to-blue-50",
    accent: "#2563EB",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
];

/**
 * 背景に薄く散らす装飾アイコン(ゲームパッド/ヘッドセット/チャット吹き出し)。
 * オリジナルの線画SVGで、ゲーム公式ロゴやキャラクターは使わない。
 */
function BackgroundDecoration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.2" className="absolute left-[6%] top-[12%] h-16 w-16 -rotate-12 opacity-[0.07]">
        <rect x="2" y="7" width="20" height="13" rx="5" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="7" y1="13" x2="7" y2="17" />
        <line x1="5" y1="15" x2="9" y2="15" />
        <circle cx="17" cy="13" r="1" />
        <circle cx="17" cy="17" r="1" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.2" className="absolute right-[8%] top-[6%] h-20 w-20 rotate-6 opacity-[0.07]">
        <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
        <rect x="1" y="14" width="6" height="8" rx="2" />
        <rect x="17" y="14" width="6" height="8" rx="2" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4B5FD" strokeWidth="1.2" className="absolute bottom-[8%] left-[12%] h-14 w-14 rotate-12 opacity-[0.07]">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.2" className="absolute bottom-[14%] right-[10%] h-12 w-12 -rotate-6 opacity-[0.06]">
        <rect x="2" y="7" width="20" height="13" rx="5" />
        <line x1="7" y1="13" x2="7" y2="17" />
        <line x1="5" y1="15" x2="9" y2="15" />
        <circle cx="17" cy="13" r="1" />
        <circle cx="17" cy="17" r="1" />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-10 pb-16 sm:pt-16 sm:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, #F5F3FF 0%, #FAFAFF 55%, #FFFFFF 100%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(99,102,241,0.07) 50%, transparent 70%)", filter: "blur(40px)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(30px)" }}
      />
      <BackgroundDecoration />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h1
              className="font-semibold text-gray-900"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", lineHeight: 1.15, letterSpacing: "-0.025em" }}
            >
              好きな<span className="text-brand-600">Creator</span>と、
              <br />
              安心して遊べる。
            </h1>
            <p className="mt-5 text-pretty text-gray-500 lg:mx-0" style={{ fontSize: "1.1rem", lineHeight: 1.75 }}>
              一緒に遊ぶ、コーチングを受ける、推しと
              <span className="whitespace-nowrap">交流する。</span>
              <br />
              ゲーム特化のマッチングサービスで、
              <br />
              あなたにぴったりのCreatorが
              <span className="whitespace-nowrap">きっと見つかる。</span>
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-start lg:justify-start">
              <ButtonLink href="/creators" size="lg" className="w-full whitespace-nowrap sm:w-auto">
                Creatorを探す
              </ButtonLink>
              <ButtonLink href="/signup" size="lg" variant="outline" className="w-full whitespace-nowrap bg-white sm:w-auto">
                Creatorとして登録する
              </ButtonLink>
            </div>
            <div className="mt-9 flex flex-col items-center gap-3 text-sm text-gray-600 sm:items-start">
              {heroPoints.map((point) => (
                <div key={point.text} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-base">
                    {point.icon}
                  </span>
                  <span>{point.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:flex-1">
            <HeroIllustration />
          </div>
        </div>

        <div className="mt-16 border-t border-gray-100 pt-10 sm:mt-20">
          <p className="mb-5 text-xs font-medium uppercase tracking-widest text-gray-400">
            カテゴリから探す
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/creators?category=${category.slug}`}
                className={`group relative flex min-h-[104px] flex-col overflow-hidden rounded-2xl border border-white bg-gradient-to-br p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5 ${category.gradient}`}
                style={{
                  boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)",
                }}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  className="pointer-events-none absolute -right-5 -top-6 h-24 w-24"
                >
                  <circle cx="50" cy="50" r="42" fill={category.accent} opacity="0.16" />
                  <circle cx="68" cy="28" r="10" fill={category.accent} opacity="0.3" />
                </svg>
                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-white/70">
                  {category.icon}
                </div>
                <p className="relative z-10 mt-3 text-sm font-semibold text-gray-900">{category.title}</p>
                <p className="relative z-10 mt-1 text-xs leading-relaxed text-gray-500">{category.desc}</p>
                <svg
                  aria-hidden="true"
                  className="relative z-10 mt-auto h-4 w-4 pt-2 text-gray-400 transition-transform duration-200 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
