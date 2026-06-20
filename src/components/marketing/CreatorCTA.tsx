import { ButtonLink } from "@/components/ui";

/**
 * フッター直前のCreator募集セクション。
 * Userとしてページを最後まで読んだ人にCreatorへの転換を促す。
 * ページ最後まで読んだ = 興味がある人 = Creator候補でもある。
 */
export function CreatorCTA() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-12 text-center sm:px-16"
          style={{
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #8B5CF6 100%)",
            boxShadow: "0 20px 60px rgba(79, 70, 229, 0.35)",
          }}
        >
          {/* 装飾サークル */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full"
            style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)" }} />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200">
              🎮 Creator募集中
            </p>
            <h2
              className="mt-3 font-bold text-white"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              あなたのゲームスキルを<br />必要としている人がいます
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-indigo-200">
              登録無料・手数料なし。まず1件、試してみませんか。<br />
              審査なし・5分で登録できます。
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <ButtonLink href="/signup" size="lg"
                className="whitespace-nowrap !bg-white !text-indigo-700 hover:!bg-indigo-50"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                Creatorとして無料で登録する
              </ButtonLink>
              <span className="text-xs text-indigo-300">審査なし · 手数料なし · 今すぐ開始</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
