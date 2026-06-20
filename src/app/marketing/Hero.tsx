import { ButtonLink } from "@/components/ui";
import { HeroIllustration } from "./HeroIllustration";

export function Hero() {
  return (
    <section className="px-6 pt-12 pb-10 sm:pt-20 sm:pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-center sm:gap-12">
          {/* テキスト側 */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-[2rem] font-medium leading-snug tracking-tight text-gray-900 sm:text-5xl">
              <span className="inline-block">ゲームの時間を、</span>
              <span className="inline-block">特別な体験に。</span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-gray-500 sm:text-base">
              一緒に遊ぶ。学ぶ。応援する。
              <br />
              ゲームが得意な人と、遊びたい人をつなぐプラットフォーム。
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              <ButtonLink href="/signup" size="lg">
                Creatorとして登録
              </ButtonLink>
              <ButtonLink href="/creators" size="lg" variant="outline">
                プレイヤーを探す
              </ButtonLink>
            </div>
          </div>

          {/* イラスト側 */}
          <div className="w-full max-w-xs sm:max-w-none sm:flex-1">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
