import Link from "next/link";

const sections = [
  {
    icon: "💰",
    title: "料金について",
    content: "現在、GameMatchの手数料は0円です。Creatorが設定した料金は、全額Creatorへお支払いいただきます。",
  },
  {
    icon: "💬",
    title: "連絡方法について",
    content: "マッチング成立後は、Discordなどのボイスチャット・テキストチャットを利用して連絡を取り合っていただきます。メールアドレスなどの個人情報は公開されません。",
  },
  {
    icon: "🚫",
    title: "禁止事項",
    content: null,
    list: [
      "虚偽のプロフィール登録",
      "嫌がらせや暴言などの迷惑行為",
      "個人情報の無断収集・公開",
      "法令・利用規約に違反する行為",
    ],
  },
  {
    icon: "❌",
    title: "キャンセルについて",
    content: "Creatorは承認前であれば自由に辞退できます。マッチング成立後のキャンセルは、双方でご相談ください。",
  },
  {
    icon: "⚠️",
    title: "トラブルが起きた場合",
    content: "トラブルが発生した場合は、お問い合わせフォームよりご連絡ください。内容を確認し、利用規約に基づいて対応いたします。",
  },
  {
    icon: "🚧",
    title: "β版について",
    content: null,
    list: [
      "機能が限られている場合があります",
      "決済機能は現在準備中です",
      "ご意見・ご要望はお問い合わせから歓迎します",
    ],
    note: "皆さまのフィードバックをもとに、より良いサービスへ成長させていきます。",
  },
];

export default function SafetyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-semibold text-gray-900"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}>
        安心して利用するために
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        GameMatchを安心してご利用いただくための情報をまとめています。
      </p>

      <div className="mt-10 flex flex-col gap-5">
        {sections.map((section) => (
          <div key={section.title}
            className="rounded-2xl border border-gray-100 bg-white p-6"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="font-semibold text-gray-900">{section.title}</h2>
            </div>
            {section.content && (
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{section.content}</p>
            )}
            {section.list && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {section.list.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5 text-gray-400">・</span>{item}
                  </li>
                ))}
              </ul>
            )}
            {section.note && (
              <p className="mt-3 text-sm text-gray-500 italic">{section.note}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50 px-6 py-5 text-center">
        <p className="text-sm text-gray-600">それでも不安なことがあれば、お気軽にご相談ください。</p>
        <Link href="/contact"
          className="mt-2 inline-block text-sm font-semibold text-indigo-600 hover:underline">
          お問い合わせはこちら →
        </Link>
      </div>
    </main>
  );
}
