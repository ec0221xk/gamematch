import { Avatar, Badge } from "@/components/ui";

const creatorTags = ["VC対応", "初心者歓迎", "ランクアップ支援"];

// モバイル(2カラム)ではカード内要素を縮小し、lg以上で元のサイズに戻すためのoverride。
// Avatar/Badgeは共通コンポーネントでpropから固定サイズclassが来るため、
// !importantで確実に上書きする(base=モバイル用縮小サイズ、lg:=元のサイズを復元)。
const COMPACT_AVATAR_CLASS = "lg:!h-20 lg:!w-20 lg:!text-lg";
const COMPACT_BADGE_CLASS = "!px-2 !py-0.5 !text-[10px] lg:!px-2.5 lg:!py-1 lg:!text-xs";

/**
 * Hero右側: Creator/Userがマッチングする様子を表したイメージ図。
 * サンプルの名前(あおい/ひらく)・評価・料金は全て架空の例、実在の人物・実績ではない
 * (実際のCreatorCard等では星評価は表示しない。ここは説明用イメージのみの特例)。
 *
 * モバイル(lg未満)ではCreatorカードとUserカードを横並び2カラムにし、
 * その下に「マッチング成立」の一連の流れを配置する(縦一直線だと
 * 「Creatorが申し込んでいる」ように見えてしまうため、両者が対等に
 * 歩み寄る構図にする)。lg以上は横一列(Creator→中央→User)。
 */
export function HeroIllustration() {
  return (
    <div className="relative">
      <IllustrationBackgroundDecoration />
      <div
        className="relative grid grid-cols-2 items-start gap-x-3 gap-y-5 lg:flex lg:flex-row lg:items-center lg:gap-3"
        style={{ gridTemplateAreas: '"creator user" "center center"' }}
      >
        {/* ===== Creatorカード ===== */}
        <div
          style={{ gridArea: "creator" }}
          className="w-full min-w-0 rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_4px_24px_rgba(99,102,241,0.08)] sm:p-4 lg:max-w-none lg:flex-1 lg:p-5"
        >
          <div className="flex items-center justify-between">
            <Badge variant="brand" className={COMPACT_BADGE_CLASS}>
              Creator
            </Badge>
            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-500 lg:text-xs">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 lg:h-3.5 lg:w-3.5" aria-hidden="true">
                <path d="M12 2.5l2.9 6.6 7.1.7-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.7 7.1-.7z" />
              </svg>
              4.9
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 lg:mt-3 lg:gap-3">
            <div className="relative shrink-0">
              <Avatar
                src="/images/hero/creator-avatar.png"
                alt="あおい"
                size="md"
                className={COMPACT_AVATAR_CLASS}
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400 lg:h-3 lg:w-3"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-gray-900 lg:text-sm">あおい</p>
              <p className="flex items-center gap-1 text-[10px] text-emerald-600 lg:text-xs">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                オンライン
              </p>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-gray-400 lg:mt-3 lg:text-xs">Apex Legends</p>
          <div className="mt-1.5 lg:mt-2">
            <Badge variant="brand" className={COMPACT_BADGE_CLASS}>
              マスター
            </Badge>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1 lg:mt-2 lg:gap-1.5">
            {creatorTags.map((tag) => (
              <Badge key={tag} className={COMPACT_BADGE_CLASS}>
                {tag}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-xs font-bold text-gray-900 lg:mt-3 lg:text-sm">
            ¥1,500<span className="ml-1 text-[9px] font-normal text-gray-400 lg:text-xs">/ 1回</span>
          </p>
        </div>

        {/* ===== 中央: マッチング成立(モバイルは2カードの下、lgは間に配置) ===== */}
        <div style={{ gridArea: "center" }} className="flex flex-col items-center gap-2 py-1 lg:shrink-0 lg:gap-3">
          <SpeechBubble title="申込み" desc="一緒に遊びたい！ コーチングを受けたい！" tailPosition="bottom" />
          <div
            className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full text-center shadow-[0_8px_24px_rgba(79,70,229,0.3)] lg:h-24 lg:w-24"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 lg:h-6 lg:w-6"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="mt-0.5 text-[8px] font-bold leading-tight text-white lg:mt-1 lg:text-[11px]">
              マッチング
              <br />
              成立！
            </p>
          </div>
          <SpeechBubble title="Discordで日時を調整" desc="やり取りは安心・安全" tailPosition="top" />
        </div>

        {/* ===== Userカード ===== */}
        <div
          style={{ gridArea: "user" }}
          className="w-full min-w-0 rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_4px_24px_rgba(99,102,241,0.08)] sm:p-4 lg:max-w-none lg:flex-1 lg:p-5"
        >
          <span className="inline-flex items-center whitespace-nowrap rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700 lg:px-2.5 lg:py-1 lg:text-xs">
            User
          </span>
          <div className="mt-2 flex items-center gap-2 lg:mt-3 lg:gap-3">
            <div className="relative shrink-0">
              <Avatar src="/images/hero/user-avatar.png" alt="ひらく" size="md" className={COMPACT_AVATAR_CLASS} />
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400 lg:h-3 lg:w-3"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-gray-900 lg:text-sm">ひらく</p>
              <p className="flex items-center gap-1 text-[10px] text-emerald-600 lg:text-xs">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                オンライン
              </p>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-gray-400 lg:mt-3 lg:text-xs">はじめて</p>
          <div className="relative mt-3 lg:mt-4">
            <span
              aria-hidden="true"
              className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 rounded-tl-sm border-l border-t border-gray-100 bg-gray-50"
            />
            <div className="relative rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
              <p className="text-[10px] leading-relaxed text-gray-600 lg:text-xs">
                ダイヤを目指して頑張りたいです！優しく教えてください！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 中央フローの「申込み」「Discordで日時を調整」を表す吹き出し型カード。
 * tailPositionでマッチング成立の円に向けて尻尾の向きを変える。
 */
function SpeechBubble({
  title,
  desc,
  tailPosition,
}: {
  title: string;
  desc: string;
  tailPosition: "top" | "bottom";
}) {
  return (
    <div className="relative w-36 shrink-0">
      {tailPosition === "top" && (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-indigo-100 bg-indigo-50/60"
        />
      )}
      <div className="relative rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-center">
        <p className="text-[10px] font-semibold text-indigo-700">{title}</p>
        <p className="mt-0.5 text-[9px] leading-tight text-gray-500">{desc}</p>
      </div>
      {tailPosition === "bottom" && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-indigo-100 bg-indigo-50/60"
        />
      )}
    </div>
  );
}

/**
 * イメージ図の背景に薄く配置するコントローラー等のアイコン装飾(薄紫)。
 * Hero全体のBackgroundDecorationとは別に、イメージ図の周りだけに配置する。
 */
function IllustrationBackgroundDecoration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4B5FD" strokeWidth="1.3" className="absolute -left-3 -top-5 h-12 w-12 -rotate-12 opacity-50">
        <rect x="2" y="7" width="20" height="13" rx="5" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="7" y1="13" x2="7" y2="17" />
        <line x1="5" y1="15" x2="9" y2="15" />
        <circle cx="17" cy="13" r="1" />
        <circle cx="17" cy="17" r="1" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="#DDD6FE" strokeWidth="1.3" className="absolute -right-2 bottom-2 h-10 w-10 rotate-6 opacity-60">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="#DDD6FE" stroke="none" className="absolute right-[38%] top-0 h-5 w-5 opacity-70">
        <path d="M12 2.5l1.6 3.6 3.9.4-3 2.6.9 3.9L12 11l-3.4 2 .9-3.9-3-2.6 3.9-.4z" />
      </svg>
    </div>
  );
}
