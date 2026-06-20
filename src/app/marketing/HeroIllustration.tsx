/**
 * Heroセクションの右側に表示するSVGイラスト。
 * ゲームコントローラーを中心に、CreatorとUserが繋がる瞬間を表現。
 * 白基調 + ブランドカラー(インディゴ系)のみ使用。派手な演出なし。
 */
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 480 400"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-md mx-auto"
      aria-hidden="true"
    >
      {/* 背景の大きな円 */}
      <circle cx="240" cy="200" r="170" fill="#EEF2FF" />

      {/* 装飾ドット */}
      <circle cx="80" cy="80" r="6" fill="#C7D2FE" />
      <circle cx="400" cy="60" r="8" fill="#A5B4FC" />
      <circle cx="60" cy="320" r="5" fill="#818CF8" opacity="0.5" />
      <circle cx="420" cy="340" r="7" fill="#C7D2FE" />
      <circle cx="360" cy="90" r="4" fill="#818CF8" />

      {/* === Creatorカード(左) === */}
      <g filter="url(#shadow)">
        <rect x="20" y="90" width="175" height="120" rx="16" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      </g>
      {/* アバター */}
      <circle cx="65" cy="135" r="26" fill="#E0E7FF" />
      <text x="65" y="142" textAnchor="middle" fontSize="20" fontWeight="600" fill="#4F46E5" fontFamily="sans-serif">あ</text>
      {/* 名前・ゲーム */}
      <text x="105" y="126" fontSize="13" fontWeight="600" fill="#111827" fontFamily="sans-serif">あおい</text>
      <text x="105" y="144" fontSize="11" fill="#6B7280" fontFamily="sans-serif">Apex Legends</text>
      {/* バッジ */}
      <rect x="35" y="168" width="64" height="22" rx="11" fill="#EEF2FF" />
      <text x="67" y="183" textAnchor="middle" fontSize="11" fill="#4F46E5" fontFamily="sans-serif">マスター</text>
      {/* 料金 */}
      <text x="115" y="183" fontSize="12" fontWeight="600" fill="#111827" fontFamily="sans-serif">¥1,500</text>
      {/* Creatorラベル */}
      <rect x="115" y="160" width="56" height="18" rx="9" fill="#F3F4F6" />
      <text x="143" y="173" textAnchor="middle" fontSize="10" fill="#6B7280" fontFamily="sans-serif">Creator</text>

      {/* === コントローラー(中央) === */}
      <g transform="translate(197, 172)">
        {/* 本体 */}
        <rect x="0" y="0" width="86" height="56" rx="28" fill="#4F46E5" />
        {/* グリップ左 */}
        <ellipse cx="16" cy="50" rx="12" ry="16" fill="#4338CA" />
        {/* グリップ右 */}
        <ellipse cx="70" cy="50" rx="12" ry="16" fill="#4338CA" />
        {/* 十字キー */}
        <rect x="10" y="21" width="22" height="8" rx="4" fill="white" opacity="0.5" />
        <rect x="17" y="14" width="8" height="22" rx="4" fill="white" opacity="0.5" />
        {/* ボタン群 */}
        <circle cx="62" cy="18" r="5" fill="#818CF8" />
        <circle cx="72" cy="27" r="5" fill="#A5B4FC" />
        <circle cx="53" cy="27" r="5" fill="#6366F1" />
        <circle cx="62" cy="36" r="5" fill="#C7D2FE" />
        {/* 中央ボタン */}
        <circle cx="43" cy="24" r="6" fill="white" opacity="0.2" />
      </g>

      {/* === Userカード(右) === */}
      <g filter="url(#shadow)">
        <rect x="285" y="160" width="175" height="120" rx="16" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      </g>
      {/* アバター */}
      <circle cx="330" cy="205" r="26" fill="#E0E7FF" />
      <text x="330" y="212" textAnchor="middle" fontSize="20" fontWeight="600" fill="#4F46E5" fontFamily="sans-serif">け</text>
      {/* 名前 */}
      <text x="370" y="196" fontSize="13" fontWeight="600" fill="#111827" fontFamily="sans-serif">けんじ</text>
      <text x="370" y="214" fontSize="11" fill="#6B7280" fontFamily="sans-serif">いつも夜帯</text>
      {/* メッセージ */}
      <rect x="300" y="238" width="144" height="30" rx="8" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
      <text x="372" y="257" textAnchor="middle" fontSize="10" fill="#6B7280" fontFamily="sans-serif">一緒に遊んでください！</text>

      {/* === 接続ライン === */}
      <path d="M 195 155 Q 240 120 285 175" stroke="#818CF8" strokeWidth="2" fill="none" strokeDasharray="6,4" opacity="0.7" />
      {/* 矢印 */}
      <polygon points="280,169 291,173 283,182" fill="#818CF8" opacity="0.7" />

      {/* === マッチラベル === */}
      <rect x="198" y="120" width="84" height="26" rx="13" fill="#4F46E5" />
      <text x="240" y="137" textAnchor="middle" fontSize="12" fontWeight="600" fill="white" fontFamily="sans-serif">マッチング</text>

      {/* === ✓バッジ === */}
      <circle cx="370" cy="163" r="12" fill="#4F46E5" />
      <text x="370" y="168" textAnchor="middle" fontSize="13" fill="white" fontFamily="sans-serif">✓</text>

      {/* シャドウフィルター */}
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.08" />
        </filter>
      </defs>
    </svg>
  );
}
