interface Article {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  afterList?: string;
}

const preamble =
  "GameMatch運営（以下「当運営」といいます）は、当運営が提供するサービス「GameMatch」（以下「本サービス」といいます）におけるユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。";

const articles: Article[] = [
  {
    heading: "第1条（取得する情報）",
    paragraphs: ["当運営は、本サービスの提供にあたり、以下の情報を取得します。"],
    list: [
      "ユーザーが登録時に入力する情報：メールアドレス、パスワード",
      "ユーザーがプロフィールとして登録する情報：表示名、自己紹介、対応ゲーム、ランク、料金、Discord ID、プロフィール画像等",
      "ユーザーが本サービスの利用を通じて入力する情報：申込内容、メッセージ、通報内容等",
      "本サービスの利用に伴い自動的に生成・記録される情報：アクセス日時、利用状況に関する情報等",
    ],
  },
  {
    heading: "第2条（利用目的）",
    paragraphs: ["当運営は、取得した情報を以下の目的で利用します。"],
    list: [
      "本サービスの提供、運営、および本人確認のため",
      "ユーザー間のマッチングを成立させるため（承認後にCreatorの連絡先をPlayerに表示する等）",
      "ユーザーからのお問い合わせに対応するため",
      "本サービスに関する通知（認証メール、申込通知等）を送信するため",
      "本規約に違反する行為への対応、および通報の確認・対応のため",
      "本サービスの改善、および新機能の検討のため",
    ],
  },
  {
    heading: "第3条（情報の第三者提供）",
    paragraphs: [
      "当運営は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。",
    ],
    list: [
      "ユーザーの同意がある場合",
      "法令に基づく場合",
      "人の生命、身体または財産の保護のために必要があり、本人の同意を得ることが困難な場合",
      "本サービスの運営に必要な範囲で、以下の外部サービスを利用する場合",
    ],
  },
  {
    heading: "第4条（外部サービスの利用）",
    paragraphs: [
      "当運営は、本サービスの提供のために以下の外部サービスを利用しており、これらのサービスに情報の保存・処理を委託しています。",
    ],
    list: [
      "Supabase（データベースおよび認証基盤の提供）",
      "Vercel（本サービスのホスティング）",
      "Resend（メール送信）",
    ],
    afterList: "これらのサービスは、それぞれのプライバシーポリシーに基づいて情報を取り扱います。",
  },
  {
    heading: "第5条（連絡先の取扱いについて）",
    paragraphs: [
      "本サービスでは、CreatorとPlayerのマッチングが成立（Creatorが申込を承認）した場合に限り、CreatorがプロフィールにDiscord ID等の連絡先を登録している場合、その連絡先が申込を行ったPlayerに表示されます。承認前に連絡先が第三者に開示されることはありません。ユーザーは、連絡先を登録することにより、承認したPlayerにDiscord ID等が表示されることに同意するものとします。",
    ],
  },
  {
    heading: "第6条（情報の管理）",
    paragraphs: [
      "当運営は、ユーザーの個人情報の漏えい、滅失またはき損を防止するため、適切な安全管理措置を講じます。ただし、インターネット上での情報の送受信において、完全な安全性を保証するものではありません。",
    ],
  },
  {
    heading: "第7条（情報の開示・訂正・削除）",
    paragraphs: [
      "ユーザーは、当運営が保有する自己の個人情報について、開示、訂正、削除を求めることができます。これらを希望する場合は、本サービス内のお問い合わせページよりご連絡ください。当運営は、本人からの請求であることを確認の上、合理的な範囲で対応します。なお、プロフィール情報等については、ユーザー自身がマイページから変更できます。",
    ],
  },
  {
    heading: "第8条（Cookie等の利用）",
    paragraphs: [
      "本サービスは、ログイン状態の維持等のために、Cookieおよびこれに類する技術を利用することがあります。",
    ],
  },
  {
    heading: "第9条（本ポリシーの変更）",
    paragraphs: [
      "当運営は、必要と判断した場合、本ポリシーを変更することがあります。変更後の本ポリシーは、本サービス上に表示された時点から効力を生じるものとします。",
    ],
  },
  {
    heading: "第10条（お問い合わせ）",
    paragraphs: [
      "本ポリシーに関するお問い合わせ、および個人情報の取扱いに関するご請求は、本サービス内のお問い合わせページよりご連絡ください。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1
        className="font-semibold text-gray-900"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}
      >
        GameMatch プライバシーポリシー
      </h1>

      <div
        className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
      >
        <p className="text-sm leading-relaxed text-gray-600">{preamble}</p>

        {articles.map((article) => (
          <div key={article.heading} className="mt-8">
            <h2 className="font-semibold text-gray-900">{article.heading}</h2>
            {article.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-2 text-sm leading-relaxed text-gray-600">
                {paragraph}
              </p>
            ))}
            {article.list && (
              <ol className="mt-2 flex flex-col gap-1.5">
                {article.list.map((item, index) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-gray-600">
                    <span className="shrink-0 text-gray-400">{index + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            )}
            {article.afterList && (
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{article.afterList}</p>
            )}
          </div>
        ))}

        <p className="mt-8 text-sm text-gray-500">制定日：2026年7月26日</p>
      </div>
    </main>
  );
}
