import { ButtonLink, Card } from "@/components/ui";

const entries = [
  {
    icon: "🎮",
    title: "マイページで出品する",
    subtitle: "Creatorとして活動する",
    desc: "プロフィールとゲームを登録すると、あなたのスキルを必要としている人と出会えます。",
    href: "/dashboard/profile",
    label: "マイページへ進む",
  },
  {
    icon: "🔍",
    title: "Creatorを探す",
    subtitle: "一緒に遊ぶ・教わる",
    desc: "ゲームやカテゴリから、あなたに合ったCreatorを探して申込みできます。",
    href: "/creators",
    label: "Creatorを探す",
  },
];

export default function WelcomePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1
        className="font-semibold text-gray-900"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}
      >
        登録ありがとうございます
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        GameMatchへようこそ。まずは、どちらから始めますか？
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <Card key={entry.href} className="flex flex-col">
            <span className="text-2xl">{entry.icon}</span>
            <h2 className="mt-3 font-semibold text-gray-900">{entry.title}</h2>
            <p className="text-xs text-gray-400">{entry.subtitle}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
              {entry.desc}
            </p>
            <ButtonLink href={entry.href} className="mt-4 self-start">
              {entry.label}
            </ButtonLink>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-gray-400">
        どちらも後から選べます。今すぐ決めなくても大丈夫です。
      </p>
    </main>
  );
}
