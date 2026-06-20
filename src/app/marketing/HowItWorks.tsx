const steps = [
  {
    number: "01",
    title: "登録",
    description: "メールアドレスだけで、すぐに始められます。",
  },
  {
    number: "02",
    title: "マッチング",
    description: "気になるCreatorを探して、依頼を送信。",
  },
  {
    number: "03",
    title: "プレイ",
    description: "Discordなどでつながり、ゲームを楽しみます。",
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
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600">
                {step.number}
              </div>
              <div>
                <p className="font-medium text-gray-900">{step.title}</p>
                <p className="mt-1 text-sm text-gray-500">{step.description}</p>
              </div>
              {/* ステップ間の矢印(デスクトップのみ) */}
              {i < steps.length - 1 && (
                <div className="hidden sm:absolute sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
