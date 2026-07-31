import { Avatar, Badge } from "@/components/ui";

const creatorTags = ["VC対応", "初心者歓迎", "ランクアップ支援"];

/**
 * Hero右側: Creator/Userがマッチングする様子を表したイメージ図。
 * 星評価・登録者数などの実績数値は使わない(実データが無いため)。
 * サンプルの名前(あおい/けんじ)は架空の例、実在の人物ではない。
 */
export function HeroIllustration() {
  return (
    <div>
      <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-center">
        {/* ===== Creatorカード ===== */}
        <div className="w-full max-w-xs rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)] lg:max-w-none lg:flex-1">
          <Badge variant="brand">Creator</Badge>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative shrink-0">
              <Avatar alt="あおい" size="md" />
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">あおい</p>
              <p className="flex items-center gap-1 text-xs text-emerald-600">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                オンライン
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">Apex Legends</p>
          <div className="mt-2">
            <Badge variant="brand">マスター</Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {creatorTags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <p className="mt-3 text-sm font-bold text-gray-900">
            ¥1,500<span className="ml-1 text-xs font-normal text-gray-400">/ 1回</span>
          </p>
        </div>

        <Arrow />

        {/* ===== 中央: マッチング成立 ===== */}
        <div className="flex shrink-0 flex-col items-center gap-2.5 py-1">
          <MiniCard title="申込み" desc="一緒に遊びたい！ コーチングを受けたい！" />
          <div
            className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full text-center shadow-[0_8px_24px_rgba(79,70,229,0.3)]"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="mt-1 text-[11px] font-bold leading-tight text-white">
              マッチング
              <br />
              成立！
            </p>
          </div>
          <MiniCard title="Discordで日時を調整" desc="やり取りは安心・安全" />
        </div>

        <Arrow />

        {/* ===== Userカード ===== */}
        <div className="w-full max-w-xs rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)] lg:max-w-none lg:flex-1">
          <span className="inline-flex items-center whitespace-nowrap rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
            User
          </span>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative shrink-0">
              <Avatar alt="けんじ" size="md" />
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">けんじ</p>
              <p className="flex items-center gap-1 text-xs text-emerald-600">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                オンライン
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">はじめて</p>
          <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
            <p className="text-xs leading-relaxed text-gray-600">
              ダイヤを目指して頑張りたいです！優しく教えてください！
            </p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-gray-400">
        ※画面はイメージです（登場人物は架空の例です）
      </p>
    </div>
  );
}

function MiniCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="w-36 shrink-0 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-center">
      <p className="text-[10px] font-semibold text-indigo-700">{title}</p>
      <p className="mt-0.5 text-[9px] leading-tight text-gray-500">{desc}</p>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C7D2FE"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0 rotate-90 lg:rotate-0"
      aria-hidden="true"
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </svg>
  );
}
