"use client";

import { useState } from "react";
import Link from "next/link";

const creatorSteps = [
  { num: "01", title: "Creator登録", desc: "プロフィール・ゲーム・料金を登録します。" },
  { num: "02", title: "Playerから申込み", desc: "依頼内容を確認します。" },
  { num: "03", title: "承認", desc: "依頼を受けるかどうかは自由に選べます。" },
  { num: "04", title: "日時を決める", desc: "Discordなどで連絡を取り、プレイ日時を調整します。" },
  { num: "05", title: "一緒にプレイ", desc: "ゲームを楽しみます。" },
  { num: "06", title: "お支払い", desc: "現在はPlayerからCreatorへ直接お支払いいただきます。" },
];

const playerSteps = [
  { num: "01", title: "Creatorを探す", desc: "ゲーム・ランク・料金などから、自分に合ったCreatorを探します。" },
  { num: "02", title: "申込み", desc: "依頼内容を入力して申込みます。" },
  { num: "03", title: "承認を待つ", desc: "Creatorが承認するとマッチング成立です。" },
  { num: "04", title: "日時を決める", desc: "Discordなどで連絡を取り、プレイ日時を調整します。" },
  { num: "05", title: "一緒にプレイ", desc: "Creatorとゲームを楽しみます。" },
  { num: "06", title: "お支払い", desc: "Creatorへ直接お支払いいただきます。" },
];

export default function HowItWorksPage() {
  const [tab, setTab] = useState<"creator" | "player">("player");
  const steps = tab === "creator" ? creatorSteps : playerSteps;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-semibold text-gray-900"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}>
        ご利用の流れ
      </h1>

      {/* タブ */}
      <div className="mt-8 flex rounded-xl border border-gray-200 bg-gray-50 p-1">
        <button
          onClick={() => setTab("player")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            tab === "player" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500"
          }`}
        >
          Playerの流れ
        </button>
        <button
          onClick={() => setTab("creator")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            tab === "creator" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500"
          }`}
        >
          Creatorの流れ
        </button>
      </div>

      {/* ステップ */}
      <div className="mt-8 flex flex-col gap-0">
        {steps.map((step, i) => (
          <div key={step.num} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}>
                {step.num}
              </div>
              {i < steps.length - 1 && (
                <div className="my-1 w-0.5 flex-1 bg-indigo-100" style={{ minHeight: "32px" }} />
              )}
            </div>
            <div className="pb-8">
              <p className="font-semibold text-gray-900" style={{ fontSize: "15px" }}>{step.title}</p>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GameMatchがサポートすること */}
      <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-6"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <h2 className="font-semibold text-gray-900">GameMatchがサポートすること</h2>
        <p className="mt-2 text-sm text-gray-500">
          GameMatchは、安心してCreatorとPlayerが出会える場を提供しています。
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2">サポートする範囲</p>
            {["Creatorを探す", "プロフィールを閲覧する", "申込みを送る", "マッチングする"].map((item) => (
              <p key={item} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                <span className="text-indigo-500">✅</span> {item}
              </p>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">現在サポートしていないこと</p>
            {["ゲームプレイ", "料金の受け渡し", "Discordなどでの連絡"].map((item) => (
              <p key={item} className="flex items-center gap-2 text-sm text-gray-500 py-1">
                <span>・</span> {item}
              </p>
            ))}
            <p className="mt-2 text-xs text-gray-400">これらは双方でご相談のうえ進めていただきます。</p>
          </div>
        </div>
      </div>

      {/* お支払いについて */}
      <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
        <h2 className="font-semibold text-gray-900">お支払いについて</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          現在はβ版のため、料金はCreatorとPlayerの間で直接お支払いいただいています。
        </p>
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-500 mb-1">利用例</p>
          {["PayPay", "銀行振込", "Wise", "その他双方が合意した方法"].map((item) => (
            <p key={item} className="text-sm text-gray-600">・{item}</p>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400">
          将来的には、GameMatch内で安全に決済できる機能を提供予定です。
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/faq" className="font-medium text-indigo-600 hover:underline">よくある質問 →</Link>
        <Link href="/safety" className="font-medium text-indigo-600 hover:underline">安心して利用するために →</Link>
      </div>
    </main>
  );
}
