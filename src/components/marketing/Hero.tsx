import { HeroIllustration } from "./HeroIllustration";
import { ButtonLink } from "@/components/ui";

// 実績が無くても正直に言える「強み・気軽さ」。安全性の詳細はTrustSectionが担うため、
// ここでは「お得さ・始めやすさ」に絞り、重複しないようにする。実データの数字は使わない。
const heroPoints = [
  { icon: "💰", text: "手数料0円・売上は全額Creatorのもの" },
  { icon: "⚡", text: "登録は無料・数分で完了" },
  { icon: "📩", text: "申込みもずっと無料・気軽に問い合わせOK" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-10 pb-12 sm:pt-16 sm:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)", filter: "blur(40px)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", filter: "blur(30px)" }} />

      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-center sm:gap-16">
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-semibold text-gray-900"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", lineHeight: 1.15, letterSpacing: "-0.025em" }}>
              好きなCreatorと、<br />安心して遊べる。
            </h1>
            <p className="mt-5 text-gray-500 sm:mx-0"
              style={{ fontSize: "1.1rem", lineHeight: 1.75 }}>
              推しとゲームを楽しみたい人も、もっと上手くなりたい人も。<br className="hidden sm:block" />あなたに合ったCreatorが見つかります。
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              <ButtonLink href="/creators" size="lg" className="whitespace-nowrap">
                Creatorを探す
              </ButtonLink>
              <ButtonLink href="/how-it-works" size="lg" variant="outline" className="whitespace-nowrap">
                使い方を見る
              </ButtonLink>
            </div>
          </div>
          <div className="w-full max-w-xs sm:max-w-none sm:flex-1">
            <HeroIllustration />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-gray-100 pt-8 text-sm text-gray-600 sm:mt-16 sm:flex-row sm:justify-center sm:gap-10 sm:pt-10">
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
    </section>
  );
}
