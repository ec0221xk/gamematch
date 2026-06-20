const steps = [
  {
    number: "01",
    title: "申込む",
    description: "メールアドレスだけで登録完了。気になるCreatorに無料で申し込めます。",
  },
  {
    number: "02",
    title: "Creatorが承認",
    description: "通常24時間以内に返答。承認されたら次のステップへ進みます。",
  },
  {
    number: "03",
    title: "オンラインで合流してプレイ開始",
    // 「Discord」を「ボイスチャット・テキストアプリ」と言い換え
    description: "ボイスチャット・テキストアプリで待ち合わせ。初めての方も安心のサポートあり。",
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-base font-medium text-gray-500">
          かんたん3ステップ
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-4">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-indigo-600"
                style={{ background: "linear-gradient(135deg, #eef2ff, #ede9fe)" }}>
                {step.number}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{step.title}</p>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
