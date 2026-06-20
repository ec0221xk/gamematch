const items = [
  {
    icon: "🔒",
    title: "個人情報は相手に公開されません",
    desc: "Discordでの連絡はプレイ承認後のみ。メールアドレスなどの個人情報は一切共有されません。",
  },
  {
    icon: "💬",
    title: "初めての方も安心のサポートあり",
    desc: "オンラインで合流する方法が分からなくても大丈夫。マイページに接続ガイドを用意しています。",
  },
  {
    icon: "🆓",
    title: "登録・申込はすべて無料",
    desc: "会員登録・申込・Creatorへの問い合わせに料金はかかりません。料金はCreatorとの合意後に発生します。",
  },
];

/**
 * ユーザーの不安を先回りして解消する安心宣言セクション。
 * 実績ゼロでも「運営が誠実である」ことを伝えることで信頼を構築する。
 */
export function TrustSection() {
  return (
    <section className="px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title}
              className="flex gap-4 rounded-2xl border border-indigo-50 bg-gradient-to-br from-indigo-50/60 to-white p-5"
              style={{ boxShadow: "0 1px 4px rgba(99,102,241,0.06)" }}>
              <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-800" style={{ fontSize: "14px" }}>
                  {item.title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
