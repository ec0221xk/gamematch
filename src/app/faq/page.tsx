import Link from "next/link";

const faqs = [
  {
    q: "申込んでから、どのような流れになりますか？",
    a: "Creatorのプロフィールから申込むと、Creatorの承認待ちになります。承認されるとマッチング成立となり、Discordなどの連絡先を交換して日時を調整できるようになります。申込みの状況はマイページからいつでも確認できます。",
  },
  {
    q: "申込みをキャンセルすることはできますか？",
    a: "承認前であれば、Creatorはいつでも自由に辞退（キャンセル）できます。Playerから申込みを取り消したい場合や、承認後にキャンセルしたい場合は、現時点では専用のキャンセル機能がないため、Discordなどで直接Creatorにご連絡いただくか、お問い合わせフォームからご相談ください。",
  },
  {
    q: "承認まではどのくらい時間がかかりますか？",
    a: "Creatorの活動状況によって異なるため、一律の目安はありません。急ぎの場合は、申込み時のメッセージ欄に希望の時期を書き添えていただくとスムーズです。しばらく経っても返信がない場合は、お問い合わせからご相談ください。",
  },
  {
    q: "運営からの返信はどのくらいで来ますか？",
    a: "運営からのご連絡は、毎日20時〜24時(日本時間)にまとめて対応しています。お問い合わせのタイミングによっては、翌日以降のご案内になる場合がありますので、あらかじめご了承ください。",
  },
  {
    q: "支払いでトラブルがあった場合はどうすればいいですか？",
    a: "GameMatchは決済に関与しておらず、支払いはCreatorとPlayerの間で直接行っていただいています。事前に支払い時期・手段をよくご確認のうえ進めることをおすすめします（Creatorが振込先情報を設定している場合、承認後にマイページから確認できます）。それでもトラブルが発生した場合は、お問い合わせフォームからご連絡ください。内容を確認し、利用規約に基づいて対応いたします。",
  },
  {
    q: "Discordを使わない場合はどうすればいいですか？",
    a: "マッチング成立後の連絡方法としてDiscordを例に案内していますが、必須ではありません。CreatorとPlayerの間で合意できれば、他の連絡手段でも問題ありません。",
  },
  {
    q: "利用手数料はかかりますか？",
    a: "GameMatchの利用手数料は現在0円です。Creatorが設定した料金は、全額Creatorが受け取ります。",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-semibold text-gray-900"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}>
        よくある質問
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        GameMatchのご利用にあたって、よくいただくご質問をまとめています。
      </p>

      <div className="mt-10 flex flex-col gap-3">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group rounded-2xl border border-gray-100 bg-white px-6 py-5 open:pb-5"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-gray-900">
              <span>{faq.q}</span>
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-indigo-400 transition-transform group-open:rotate-45"
              >
                ＋
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{faq.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50 px-6 py-5 text-center">
        <p className="text-sm text-gray-600">知りたいことが見つからなかった場合は、お気軽にご連絡ください。</p>
        <Link href="/contact"
          className="mt-2 inline-block text-sm font-semibold text-indigo-600 hover:underline">
          お問い合わせはこちら →
        </Link>
      </div>
    </main>
  );
}
