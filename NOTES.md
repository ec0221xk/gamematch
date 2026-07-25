# GameMatch 開発ノート

## プロジェクト概要
- CtoCゲームマッチングプラットフォーム（Creatorがゲームスキルを出品、Playerが申し込む）
- 本番URL: https://gamematch-six.vercel.app
- 作業フォルダ: OneDrive\Desktop\gamematch
- 技術構成: Next.js App Router / TypeScript / Tailwind / Supabase / Vercel。書き込みはClient ComponentからSupabase SDK直接＋RLSで保護。route.tsは基本不使用（auth/callbackのみ例外）

## これまで完了したこと
- ナビ順序変更、「料金の受け渡し」項目削除
- Heroコピー刷新＋CTAボタン追加
- デッドコード掃除2回（creators/creators、src/app/marketing の重複削除）
- 写真アップロード機能（avatarsバケット＋RLS＋ProfileFormにアップロードUI）
- 見せ方改善（「無料で申し込む」→「申し込む」＋料金注記、ランク表記統一、VC表記フルスペル化、Hero直下にTwoPillars追加）
- 料金の単位機能（creator_gamesにunitカラム追加、1時間/90分/3試合/1回から選択）
- Resend経由のSMTPをSupabase Authに接続（無料枠のメール制限を解消）
- オンボーディング導線（/auth/callback新設→メール認証後に/welcomeへ着地。表示名保存バグも修正）
- 実地テスト完了：新規登録→メール認証→/welcome→出品→申込 まで一周動作確認済み

## 次回の最優先課題（マッチング不成立の致命的な穴）
Playerが申込してもCreatorが気づく手段が無い。bookingsテーブル・ステータス型（pending/accepted/declined/completed）・CreatorがSELECTできるRLSは既に存在。足りないのは「見る画面」だけ。
実装順：
1. Creatorの申込一覧（/dashboard/requests、規模：小〜中。承認/辞退まで作るならbookingsのUPDATE用RLS追加が必要）
2. Playerの申込状況（/dashboard/my-requests、規模：小、①のクエリ流用）
3. メール通知（規模：中〜大、後回し）

## 注意事項
- ResendのSMTP接続は「Supabase Authが送るメール」の経路変更のみ。申込通知のようなアプリ独自メールはResend APIを直接呼ぶ実装（Edge Function+Webhook等）が別途必要。CreatorのメアドはprofilesになくauthusersにあるためservicRole経由が要る
- 独自ドメイン未取得。Resendはテストモードで、登録済みアドレス宛にしか送れない。公開前にドメイン取得＋Resendドメイン認証が必須
- Supabase無料プランは7日アクセスがないとプロジェクトが自動停止する
- スキーマ変更は「先にDBへSQL適用→その後コードpush」の順が安全
- トップの「あおい/ゆうき/みお」等はサンプルデータで実在Creatorではない

## 教訓
セッションをまたぐ記録（NOTES.md等）は、作成指示だけでなくコミット・pushまで完了を必ず確認すること。
