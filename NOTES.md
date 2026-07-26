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
- Playerが申込んだ時のCreatorへのメール通知を実装済み：
  - src/lib/supabase/admin.ts（service roleクライアント、server-onlyでクライアント側importをブロック）
  - src/app/api/bookings/notify/route.ts（Next.js Route HandlerからResend APIを直接呼ぶ方式。Edge Function+Webhookは不採用）
  - BookingFormがinsert直後にこのAPIをawait呼び出し（通知失敗時はcatchで握りつぶし、申込自体の成立には影響しない設計）
  - .env.localに SUPABASE_SERVICE_ROLE_KEY と RESEND_API_KEY を設定し、開発環境で実受信テスト成功済み（ResendアカウントのメールアドレスとCreatorのメールを一致させて送信→受信確認）
- 承認後の連絡導線を実装・動作確認済み：Player→Creator一方向。承認後（status=accepted）のみBookingCardにCreatorのDiscord IDと案内文、コピーボタンを表示。Discord ID未設定時は「Creatorがまだ連絡先を設定していません」の案内を表示。承認前は表示されないことも確認済み
- 実地テストで「探す→申込→通知→承認→連絡先表示→やり取り」の一周が実データで通ることを確認済み

## 次回やること
1. 独自ドメイン取得＋Resendドメイン認証（本番で任意のCreatorのメール宛にも通知メールを届けるため。現状onboarding@resend.devのテスト送信元のため、Resendアカウント登録メール宛にしか届かない）
2. 本番での通知メール実受信テスト（前提としてVercel側の環境変数〔Production/Preview〕に SUPABASE_SERVICE_ROLE_KEY と RESEND_API_KEY を追加する作業も未実施）
3. （将来）双方向の連絡導線：現状はPlayer→Creator一方向（承認後にCreatorのDiscord IDのみPlayerへ表示）。Creator側からもPlayerの連絡先を見せる場合は別途検討

## 注意事項
- 独自ドメイン未取得。Resendはテストモードで、アカウント登録メール宛にしか送れない。公開前にドメイン取得＋Resendドメイン認証が必須
- Supabase無料プランは7日アクセスがないとプロジェクトが自動停止する
- スキーマ変更は「先にDBへSQL適用→その後コードpush」の順が安全
- トップの「あおい/ゆうき/みお」等はサンプルデータで実在Creatorではない

## 教訓
セッションをまたぐ記録（NOTES.md等）は、作成指示だけでなくコミット・pushまで完了を必ず確認すること。
