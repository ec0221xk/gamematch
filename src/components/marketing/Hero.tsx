import { HeroIllustration } from "./HeroIllustration";
import { ButtonLink } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-8 pb-10 sm:pt-14 sm:pb-16">
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
      </div>
    </section>
  );
}
