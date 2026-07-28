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
- エラー処理の改善（まとまりB）を実装済み。これで公開前調査で「必須」とされたエラー処理系タスクは完了：
  - サイト全体の404：src/app/not-found.tsx を新設（ルート直下、/creators/[id]/not-found.tsxと同じトーン）。存在しないURLにアクセスした際、Next.jsデフォルトの英語404ではなく日本語の案内＋トップへ戻るボタンを表示
  - 予期しないサーバーエラー用のerror.tsx：src/app/error.tsx を新設（"use client"、reset()で再読み込み、トップへ戻るリンクも表示）。生のエラーはconsole.errorのみに出しUIには出さない
  - 出品削除の確認ダイアログ：DeleteOfferingButton.tsx に確認ステップを追加（「削除」クリックで即削除せず、「本当に削除しますか？」＋「削除する」/「キャンセル」の2段階に変更。誤クリックでの即削除を防止）
  - マイページのDBエラー対応：/dashboard/profile の getPageData を修正し、profilesの取得エラーを「本当に存在しない（PGRST116）」と「それ以外のDBエラー」で判別。前者のみnotFound()、後者はQueryErrorNoticeでエラー表示（本人はログイン済みなのに404が出て「アカウントが消えた」ように見える問題を解消）。同ページのoffering一覧取得エラーも同様にQueryErrorNoticeへ
  - loading.tsx：共通Spinnerコンポーネント（src/components/ui/Spinner.tsx）を新設し、/creators、/creators/[id]、/dashboard/requests、/dashboard/my-requests、/dashboard/profile にシンプルなローディング表示（スピナー＋「読み込み中...」）を追加
- 運営向け集計ダッシュボード（/admin）を実装・動作確認済み（管理者アカウントでログインし表示・集計値の妥当性を確認済み）：
  - アクセス制御：環境変数 ADMIN_USER_ID（NEXT_PUBLIC_なし＝サーバー専用）にログイン中のuser.idが一致する場合のみ表示。src/app/admin/layout.tsxでサーバー側チェックし、不一致・未ログインはnotFound()で404（存在自体を隠す）。middleware.tsのisProtectedRouteにも/adminを追加し、未ログイン時は/loginへリダイレクト
  - 集計：src/lib/queries/admin.ts が src/lib/supabase/admin.ts のservice roleクライアント（RLSバイパス）で全ユーザー横断のデータを取得。マイグレーション・View・RPCは追加せず、複数のシンプルなクエリ＋JS側集計で対応
  - 表示指標：登録ユーザー総数、Creator数（is_creator=true件数）、出品総数、申込総数（pending/accepted/declined/completed件数）、承認率（承認済み÷（承認済み＋辞退済み）、pendingは母数に含めない）、通報件数、人気のゲーム・カテゴリ（申込件数順、上位5件）、最近の申込（直近10件）

## 次回やること
1. 【重要】Vercel（本番）の環境変数にADMIN_USER_IDが未追加。Production/Previewに追加しないと本番で管理者判定が効かず、誰も/adminにアクセスできない（＝常に404）、または設定ミス時に意図しないユーザーが管理者として扱われるリスクがあるため、pushとは別に必ず対応すること
2. 独自ドメイン取得＋Resendドメイン認証（本番で任意のCreatorのメール宛にも通知メールを届けるため。現状onboarding@resend.devのテスト送信元のため、Resendアカウント登録メール宛にしか届かない）
3. 本番での通知メール実受信テスト（前提としてVercel側の環境変数〔Production/Preview〕に SUPABASE_SERVICE_ROLE_KEY と RESEND_API_KEY を追加する作業も未実施）
4. （将来）双方向の連絡導線：現状はPlayer→Creator一方向（承認後にCreatorのDiscord IDのみPlayerへ表示）。Creator側からもPlayerの連絡先を見せる場合は別途検討
5. 通報機能のブラウザ動作確認（通報フォームの表示・送信、自己通報が弾かれること、reports_not_self制約、Table Editorでの内容確認）が未実施
6. 規約同意チェックボックスのブラウザ動作確認（未チェック時disabled・案内表示、リンクが別タブで開くこと）が未実施
7. エラー処理の改善（まとまりA・Bとも実装済み）のブラウザ動作確認が未実施：404ページ、error.tsx（意図的にエラーを起こして確認する必要あり）、出品削除の確認ダイアログ、マイページのエラー表示、各loading.tsxの表示
8. /adminダッシュボードについて、別アカウント（管理者以外）でログインした場合に404になることの確認が未実施（管理者以外が見られないことの検証）

## 注意事項
- 独自ドメイン未取得。Resendはテストモードで、アカウント登録メール宛にしか送れない。公開前にドメイン取得＋Resendドメイン認証が必須
- Supabase無料プランは7日アクセスがないとプロジェクトが自動停止する
- スキーマ変更は「先にDBへSQL適用→その後コードpush」の順が安全
- トップの「あおい/ゆうき/みお」等はサンプルデータで実在Creatorではない
- 【重要】Vercel（本番）の環境変数にADMIN_USER_IDを追加する必要がある。未設定だと本番で管理者判定が効かず、誰も/adminにアクセスできない（またはコード次第では想定外の挙動になりうる）

## 教訓
セッションをまたぐ記録（NOTES.md等）は、作成指示だけでなくコミット・pushまで完了を必ず確認すること。
