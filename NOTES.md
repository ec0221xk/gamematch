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
- 申込（bookings）まわりを実装・動作確認済み：
  - bookingsのUPDATE用RLS追加（creator_idが自分＆pending中の行のみ、statusはaccepted/declinedにのみ更新可）
  - /dashboard/requests：Creatorの申込一覧＋承認/辞退ボタン
  - /dashboard/my-requests：Playerの申込状況（ステータスバッジ表示）
  - Header.tsxのログイン時ナビに「受け取った申込」（Creatorのみ表示）「申込状況」を追加

## 次回の最優先課題（マッチング成立後の連絡導線）
申込の「見る画面」（一覧・承認/辞退）はできたが、Creatorは能動的に/dashboard/requestsを開かないと申込に気づけない。次はこの通知の穴を埋める。
実装順：
1. メール通知（Playerが申込んだ時にCreatorへ、Creatorが承認/辞退した時にPlayerへ）。規模：中〜大。ResendはSMTP経路のみ接続済みでAPI直接呼び出しは未実装のため、Edge Function+Webhook等が別途必要（詳細は下記注意事項）。独自ドメイン取得＋Resendドメイン認証も前提条件
2. 承認後のやり取り導線（Discord IDは既にprofilesにあるが、bookings画面から直接見える形になっていない。承認後にCreatorのDiscord IDをPlayerに表示する等、実際に約束を取り付けられる導線を検討）

## 注意事項
- ResendのSMTP接続は「Supabase Authが送るメール」の経路変更のみ。申込通知のようなアプリ独自メールはResend APIを直接呼ぶ実装（Edge Function+Webhook等）が別途必要。CreatorのメアドはprofilesになくauthusersにあるためservicRole経由が要る
- 独自ドメイン未取得。Resendはテストモードで、登録済みアドレス宛にしか送れない。公開前にドメイン取得＋Resendドメイン認証が必須
- Supabase無料プランは7日アクセスがないとプロジェクトが自動停止する
- スキーマ変更は「先にDBへSQL適用→その後コードpush」の順が安全
- トップの「あおい/ゆうき/みお」等はサンプルデータで実在Creatorではない

## 教訓
セッションをまたぐ記録（NOTES.md等）は、作成指示だけでなくコミット・pushまで完了を必ず確認すること。
