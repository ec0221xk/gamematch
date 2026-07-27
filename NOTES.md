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
- 通報機能を実装済み（ブラウザでの動作確認はまだ未実施）：
  - supabase/migrations/0006_reports.sql 適用済み（reportsテーブル、reason enum4択、reports_not_self制約、RLS：insertは本人のみ・selectは非公開）
  - /creators/[id]/report を新設（BookingFormと同じくモーダルではなく専用ページ方式。middleware.tsで未ログイン時は/loginへリダイレクト）
  - ReportForm（理由セレクト＋自由記述＋送信ボタン、reportsへ直接insert、送信後「通報を受け付けました。運営が確認します」を表示）
  - Creator詳細ページ下部に控えめな「このユーザーを通報する」リンクを追加（自分自身のプロフィールでは非表示。サーバー側・フォーム側・DB check制約の三重で自己通報を防止）
  - 通報したことが相手に通知される機能はなし。運営確認は引き続きSupabase Table Editorで直接行う想定（管理画面は未実装）
- 利用規約・プライバシーポリシーのページを実装（/terms, /privacy、フッターにリンク）。ログイン不要・middlewareの保護対象外。Footer.tsxの既存リンク（旧/legal/terms, /legal/privacy）のhrefを新パスに修正
- SignupForm.tsxに「利用規約・プライバシーポリシーに同意し、18歳以上であることを確認しました」チェックボックスを追加済み（ラベル内リンクは/terms・/privacyを別タブで開く）。未チェックだと登録ボタンがdisabled、かつ送信時にもガードして案内メッセージを表示。同意の事実はDBには保存せずフロント制御のみ（証跡が必要になったらprofilesにterms_agreed_at等を追加する想定、今回はスキーマ変更なしの方針で対応）
- 公開前の粗さ調査（空状態・エラー時・ローディング表示）を実施し、エラー処理の改善（まとまりA）を実装済み：
  - フォーム系のエラーメッセージ日本語化：src/lib/utils/errorMessage.ts の toUserErrorMessage() ヘルパーを新設。Supabaseの生の英語エラーメッセージ（"User already registered"等）を固定の日本語文言にマッピングし、マッピング外は汎用フォールバック文言に。生のエラーはconsole.errorのみに出力しUIには出さない（Login/Signup/Booking/Report/Profile/Offering各フォーム、BookingCardに適用）
  - 全送信ハンドラをtry/catchで保護：Login/Signup/Logout/Booking/Report/Profile/Offering各フォーム、BookingCard（承認・辞退）、DeleteOfferingButtonの送信・更新・削除処理をtry/catchで囲み、通信断等で例外が発生してもisLoadingがfalseに戻り「送信中...」のまま固まらないように修正。DeleteOfferingButtonはエラーハンドリングが元々皆無だったため今回新規追加
  - 一覧クエリのResult型化：src/lib/types/query.ts に QueryResult<T> 型を新設。searchCreators/getFeaturedCreators（creators.ts）、getReceivedBookings/getSentBookings（bookings.ts）がSupabaseエラー時に空配列ではなく { ok: false } を返すよう変更し、呼び出し側（/creators、/dashboard/requests、/dashboard/my-requests、トップページのFeaturedCreators）でSupabase障害を「データ0件」の空状態と区別できるようにした。障害時は共通コンポーネント QueryErrorNotice（src/components/ui/QueryErrorNotice.tsx、赤系配色）を表示。トップページのFeaturedCreatorsのみ、失敗時はページ全体をエラーにせずセクションごと非表示にする方針（成功時0件のサンプルCreator表示は維持）

## 次回やること
1. 独自ドメイン取得＋Resendドメイン認証（本番で任意のCreatorのメール宛にも通知メールを届けるため。現状onboarding@resend.devのテスト送信元のため、Resendアカウント登録メール宛にしか届かない）
2. 本番での通知メール実受信テスト（前提としてVercel側の環境変数〔Production/Preview〕に SUPABASE_SERVICE_ROLE_KEY と RESEND_API_KEY を追加する作業も未実施）
3. （将来）双方向の連絡導線：現状はPlayer→Creator一方向（承認後にCreatorのDiscord IDのみPlayerへ表示）。Creator側からもPlayerの連絡先を見せる場合は別途検討
4. 通報機能のブラウザ動作確認（通報フォームの表示・送信、自己通報が弾かれること、reports_not_self制約、Table Editorでの内容確認）が未実施
5. 規約同意チェックボックスのブラウザ動作確認（未チェック時disabled・案内表示、リンクが別タブで開くこと）が未実施
6. エラー処理の改善（まとまりB、公開前に必ず直すべき残タスク）：
   - サイト全体の404ページ（ルート直下に日本語のnot-found.tsxを追加。現状/creators/[id]用の1件しかなく、それ以外の存在しないURLはNext.jsデフォルトの英語404が出る）
   - 予期しないサーバーエラー用のerror.tsx（プロジェクト全体に1つも無く、Server Componentで例外が起きると技術的なデフォルトエラー画面が露出する）
   - 出品削除（DeleteOfferingButton）の確認ダイアログ（エラー表示は対応済みだが、削除前のconfirm相当のダイアログはまだ無い）
   - マイページ（/dashboard/profile）でDBエラー時に404ではなくエラー表示を出す対応（現状getPageDataがエラーを判別せず、DBエラー時に本人のプロフィールが「見つかりません」扱いになってしまう）
   - 主要ページへのloading.tsx追加（ローディング中のスケルトン/スピナー表示。現状は皆無で、データ取得が遅いと押しても無反応に見える）

## 注意事項
- 独自ドメイン未取得。Resendはテストモードで、アカウント登録メール宛にしか送れない。公開前にドメイン取得＋Resendドメイン認証が必須
- Supabase無料プランは7日アクセスがないとプロジェクトが自動停止する
- スキーマ変更は「先にDBへSQL適用→その後コードpush」の順が安全
- トップの「あおい/ゆうき/みお」等はサンプルデータで実在Creatorではない

## 教訓
セッションをまたぐ記録（NOTES.md等）は、作成指示だけでなくコミット・pushまで完了を必ず確認すること。
