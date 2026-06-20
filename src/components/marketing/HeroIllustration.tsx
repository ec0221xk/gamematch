/**
 * Heroイラスト: CreatorとUserがマッチングする瞬間を表現。
 * 左: Creatorプロフィールカード / 右: Userリクエストカード / 中央: マッチング表示
 * 下部: 信頼感を補強するミニ統計
 */
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 480 420"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-md mx-auto"
      aria-hidden="true"
    >
      {/* 背景の大きな円 */}
      <circle cx="240" cy="195" r="175" fill="#EEF2FF" />
      <circle cx="240" cy="195" r="140" fill="#F5F3FF" opacity="0.5" />

      {/* 装飾ドット */}
      <circle cx="70" cy="70" r="7" fill="#C7D2FE" />
      <circle cx="410" cy="55" r="9" fill="#DDD6FE" />
      <circle cx="55" cy="320" r="5" fill="#A5B4FC" opacity="0.6" />
      <circle cx="425" cy="340" r="7" fill="#C4B5FD" />

      {/* ===== Creatorカード(左) ===== */}
      <g filter="url(#cardShadow)">
        <rect x="12" y="80" width="178" height="148" rx="18" fill="white" />
      </g>
      {/* Creatorラベル */}
      <rect x="28" y="94" width="54" height="18" rx="9" fill="#EEF2FF" />
      <text x="55" y="107" textAnchor="middle" fontSize="10" fontWeight="600" fill="#4F46E5" fontFamily="sans-serif">Creator</text>
      {/* アバター(グラデーション) */}
      <defs>
        <linearGradient id="avGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1"/>
          <stop offset="100%" stopColor="#8B5CF6"/>
        </linearGradient>
        <linearGradient id="avGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#A78BFA"/>
        </linearGradient>
        <linearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4F46E5"/>
          <stop offset="100%" stopColor="#8B5CF6"/>
        </linearGradient>
        <filter id="cardShadow" x="-8%" y="-8%" width="116%" height="128%">
          <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#6366F1" floodOpacity="0.1"/>
        </filter>
        <filter id="matchShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#4F46E5" floodOpacity="0.25"/>
        </filter>
      </defs>
      <circle cx="60" cy="145" r="26" fill="url(#avGrad1)" />
      <text x="60" y="152" textAnchor="middle" fontSize="20" fontWeight="700" fill="white" fontFamily="sans-serif">あ</text>
      {/* 名前・ゲーム */}
      <text x="100" y="137" fontSize="14" fontWeight="700" fill="#111827" fontFamily="sans-serif">あおい</text>
      <text x="100" y="155" fontSize="11" fill="#9CA3AF" fontFamily="sans-serif">Apex Legends</text>
      {/* ランクバッジ */}
      <rect x="28" y="180" width="60" height="20" rx="10" fill="#EEF2FF" />
      <text x="58" y="194" textAnchor="middle" fontSize="11" fontWeight="600" fill="#4F46E5" fontFamily="sans-serif">マスター</text>
      {/* 評価 */}
      <text x="102" y="191" fontSize="12" fill="#FBBF24" fontFamily="sans-serif">★</text>
      <text x="116" y="191" fontSize="11" fontWeight="600" fill="#374151" fontFamily="sans-serif">4.9</text>
      {/* 料金 */}
      <text x="28" y="217" fontSize="16" fontWeight="800" fill="#111827" fontFamily="sans-serif">¥1,500</text>
      <text x="90" y="217" fontSize="11" fill="#9CA3AF" fontFamily="sans-serif">/ 1回</text>

      {/* ===== 中央マッチングバッジ ===== */}
      <g filter="url(#matchShadow)">
        <rect x="175" y="160" width="130" height="50" rx="25" fill="url(#btnGrad)" />
      </g>
      <text x="240" y="182" textAnchor="middle" fontSize="11" fontWeight="700" fill="white" fontFamily="sans-serif">✓  マッチング</text>
      <text x="240" y="198" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.75)" fontFamily="sans-serif">完了しました！</text>

      {/* 接続ライン */}
      <line x1="190" y1="185" x2="175" y2="185" stroke="#C7D2FE" strokeWidth="1.5" strokeDasharray="4,3"/>
      <line x1="305" y1="185" x2="290" y2="185" stroke="#C7D2FE" strokeWidth="1.5" strokeDasharray="4,3"/>

      {/* ===== Userカード(右) ===== */}
      <g filter="url(#cardShadow)">
        <rect x="290" y="80" width="178" height="148" rx="18" fill="white" />
      </g>
      {/* Userラベル */}
      <rect x="306" y="94" width="40" height="18" rx="9" fill="#F5F3FF" />
      <text x="326" y="107" textAnchor="middle" fontSize="10" fontWeight="600" fill="#7C3AED" fontFamily="sans-serif">User</text>
      {/* アバター */}
      <circle cx="338" cy="145" r="26" fill="url(#avGrad2)" />
      <text x="338" y="152" textAnchor="middle" fontSize="20" fontWeight="700" fill="white" fontFamily="sans-serif">け</text>
      {/* 名前 */}
      <text x="378" y="137" fontSize="14" fontWeight="700" fill="#111827" fontFamily="sans-serif">けんじ</text>
      <text x="378" y="155" fontSize="11" fill="#9CA3AF" fontFamily="sans-serif">はじめて</text>
      {/* メッセージバブル */}
      <rect x="306" y="178" width="148" height="40" rx="12" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1"/>
      <text x="380" y="196" textAnchor="middle" fontSize="10" fill="#6B7280" fontFamily="sans-serif">一緒に遊んで</text>
      <text x="380" y="210" textAnchor="middle" fontSize="10" fill="#6B7280" fontFamily="sans-serif">ください！🎮</text>

      {/* ===== ミニ統計(イラスト下部) ===== */}
      <rect x="90" y="260" width="300" height="52" rx="26" fill="white" filter="url(#cardShadow)"/>
      {/* 区切り線 */}
      <line x1="240" y1="270" x2="240" y2="302" stroke="#E5E7EB" strokeWidth="1"/>
      {/* 左: Creator数 */}
      <text x="165" y="281" textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="sans-serif">🎮 登録Creator</text>
      <text x="165" y="299" textAnchor="middle" fontSize="16" fontWeight="800" fill="#4F46E5" fontFamily="sans-serif">120+</text>
      {/* 右: マッチング数 */}
      <text x="315" y="281" textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="sans-serif">🤝 累計マッチング</text>
      <text x="315" y="299" textAnchor="middle" fontSize="16" fontWeight="800" fill="#8B5CF6" fontFamily="sans-serif">1,500+</text>

      {/* ===== 対応ゲーム数(右下小バッジ) ===== */}
      <rect x="340" y="340" width="110" height="30" rx="15" fill="white" filter="url(#cardShadow)"/>
      <text x="395" y="360" textAnchor="middle" fontSize="11" fontWeight="600" fill="#6B7280" fontFamily="sans-serif">🔥 6タイトル対応</text>
    </svg>
  );
}
