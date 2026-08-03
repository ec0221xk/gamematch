"use client";

import { useState } from "react";
import Link from "next/link";

const creatorSteps = [
  { num: "01", title: "登録する", desc: "プロフィール・タグ・支払い条件を設定します。" },
  { num: "02", title: "出品を作る", desc: "ゲーム / カテゴリ / 料金 / 単位 / 説明を設定します。" },
  { num: "03", title: "申し込みを受ける", desc: "Playerからの依頼内容を確認します。" },
  { num: "04", title: "承認する", desc: "承認すると、お互いの連絡先が表示されます。" },
  { num: "05", title: "【前払いの場合】入金を確認する", desc: "プレイ前に、入金を確認します。" },
  { num: "06", title: "日程を決めて、一緒にプレイする", desc: "オンラインで合流し、ゲームを楽しみます。" },
  { num: "07", title: "【後払いの場合】入金を確認する", desc: "プレイ後に、入金を確認します。" },
];

const playerSteps = [
  { num: "01", title: "登録する", desc: "アカウントを作成します。" },
  { num: "02", title: "出品を探す", desc: "申し込む前に、支払い条件を必ずご確認ください。" },
  { num: "03", title: "申し込む", desc: "依頼内容を入力して申し込みます。" },
  { num: "04", title: "承認を待つ", desc: "承認されると、連絡先と振込先が表示されます。" },
  { num: "05", title: "【前払いの場合】お支払い", desc: "プレイ前にお支払いいただきます。" },
  { num: "06", title: "日程を決めて、一緒にプレイする", desc: "オンラインで合流し、ゲームを楽しみます。" },
  { num: "07", title: "【後払いの場合】お支払い", desc: "プレイ後にお支払いいただきます。" },
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

      {/* 役割の説明 */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-6">
        <p className="text-sm text-gray-600">GameMatchには2つの立場があります。</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-gray-900">■ Creator(クリエイター)</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              一緒に遊ぶ・コーチングを「提供する」人
              <br />
              出品を作って募集します
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">■ Player(プレイヤー)</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              一緒に遊びたい・教わりたい「依頼する」人
              <br />
              出品を探して申し込みます
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400">※同じアカウントで両方できます</p>
      </div>

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
            {["ゲームプレイ", "Discordなどでの連絡"].map((item) => (
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
          支払いのタイミング(前払い / 後払い)と手段は、Creatorがプロフィールで設定し、その方の全ての出品に共通で適用されます。
          <br />
          申し込む前に、Creatorの詳細ページ・申込み画面で必ずご確認ください。
          <br />
          振込先はマッチング成立後にのみ表示されます。
          <br />
          GameMatchは決済を仲介せず、当事者間で直接やり取りいただきます。手数料は0円です。
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/faq" className="font-medium text-indigo-600 hover:underline">よくある質問 →</Link>
        <Link href="/safety" className="font-medium text-indigo-600 hover:underline">安心して利用するために →</Link>
      </div>
    </main>
  );
}

