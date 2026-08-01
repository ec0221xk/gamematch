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
- 承認後の連絡導線を実装・動作確認済み。当初はPlayer→Creator一方向（承認後にBookingCardでCreatorのDiscord IDを表示）だったが、その後双方向に対応済み：
  - getReceivedBookings（src/lib/queries/bookings.ts）のselectにdiscord_idを追加し、getSentBookingsと対称化。これによりCreator視点でも申込者（Player）のDiscord IDを取得できるように
  - BookingCard.tsxの表示条件をisPlayerView && status === "accepted"からstatus === "accepted"のみに変更（isPlayerViewは不要になり削除）。承認前（pending/declined）は表示されない防御はそのまま維持
  - 表示文言をotherPartyLabel（「依頼先」/「申込者」）ベースに動的化。実装の過程で、Creator視点で見ると「Creatorがまだ連絡先を設定していません」という誤った文言が出るバグが判明し、あわせて解消
  - マイページ（ProfileForm.tsx）のDiscord ID欄に「承認後、マッチングした相手に表示されます」の案内文を追加（プライバシーポリシー第5条との整合、承認相手に表示されることの事前認識のため）
  - Creator視点で承認済みの申込に申込者のDiscord IDが表示されること、承認前には表示されないこと、マイページの案内文表示をブラウザで動作確認済み
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
- Creator登録UIの簡易化として「特徴タグ」機能を実装・動作確認済み（マイページでのチェック→保存→カード/詳細表示まで一周確認済み）：
  - supabase/migrations/0007_creator_feature_tags.sql 適用済み。profilesにfeature_tags(text[]、default '{}')を追加。値は固定6種のslug（beginner_friendly/voice_chat_ok/chat_welcome/casual/hardcore/late_night）のみ許可するcheck制約＋GINインデックス。languages列と同じ設計方針（マスタテーブルは作らず、表示名はアプリ側の定数で管理）
  - src/lib/constants/creatorTags.ts（新規）：slug⇔表示名の対応表（CREATOR_TAGS、getCreatorTagLabel）。ProfileForm/CreatorCard/Creator詳細ページ/FeaturedCreatorsで共有
  - ProfileForm.tsx：チップ型チェックボックスでfeature_tagsを複数選択・保存。自己紹介欄に「推し活系」「コーチング系」の例文挿入ボタンを追加（入力済みの場合は上書き前に確認バーを表示）
  - creators.ts/creatorProfile.tsのselectにfeature_tagsを追加し、CreatorCard・Creator詳細ページ（/creators/[id]）にタグをBadge表示
  - FeaturedCreators.tsx（TOPページ注目Creator）も実データのfeature_tagsを表示するよう変更。従来は実Creatorにも「ボイスチャット対応」を固定のダミータグとして表示していた箇所を削除し、カテゴリ・ランクバッジと合わせて表示バッジ合計が最大3個に収まるよう制御（ランクありなら特徴タグ1個まで、無しなら2個まで）
  - 検索絞り込みへの活用（SearchFilter/searchCreatorsでのfeature_tagsフィルタ）は未実装、将来対応
- 3件の改善を実装・ビルド確認・push済み：
  - how-it-worksページの「現在サポートしていないこと」リストに空文字列（""）の要素が混じり「・」だけの崩れた行が出ていたバグを修正（該当要素を削除）
  - ヘッダーの「ご利用の流れ」リンクを削除。フッターには既に同リンクが存在していたため実質的に集約（トップページのHowItWorksセクションはそのまま維持）
  - 申込カード（BookingCard.tsx、/dashboard/my-requests・/dashboard/requestsで共用）に、booking.id（UUID）のハイフンを除去し先頭8文字を大文字化した「申込番号: #XXXXXXXX」を表示するよう追加。連番ではないため総件数は露出しない
- Creatorの支払い条件（送金時期・支払い手段）機能を実装・Supabase適用・ブラウザ動作確認まで完了。CtoCのお金のトラブル（前払い/後払いの食い違い、支払い手段の不一致）防止が目的。GameMatchは決済に関与しない前提で、条件はCreator自身が任意記載する：
  - `supabase/migrations/0008_payment_terms.sql`適用済み。`profiles`に`payment_timing`（text、NULL許容、'prepay'/'postpay'/'negotiable'のcheck制約）・`payment_methods`（text[]、NOT NULL default '{}'、paypay/bank_transfer/line_pay/wise/otherのcheck制約）を追加
  - 当初は`creator_games`（出品）側にも同じ2カラムを追加し「出品優先・無ければプロフィール」の優先ロジック（クエリ層で解決）を設計したが、出品ごとに支払い条件を変える運用ニーズが無いと判断し廃止。`supabase/migrations/0009_remove_offering_payment_terms.sql`適用済みで`creator_games`側のカラムは削除。**プロフィール側の値のみを使う方式に一本化**（優先ロジックのコードは実装時点から作らず、プロフィールの値をそのまま表示する形で完結）
  - `src/lib/constants/paymentTerms.ts`（新規）：支払い時期3択・支払い手段5択のslug⇔ラベル対応表（`creatorTags.ts`と同じ形）
  - `src/components/dashboard/ProfileForm.tsx`：支払い時期（Select、未設定も選べる4択）・支払い手段（チップ型チェックボックス）の入力欄を追加（出品側の入力欄〔OfferingForm.tsx〕には追加していない）
  - `src/lib/queries/creatorProfile.ts`・`src/lib/queries/offerings.ts`・`src/lib/queries/bookings.ts`：selectにprofiles.payment_timing/payment_methodsを追加し、Creator詳細・申込・申込カードの各表示にプロフィールの値をそのまま渡す
  - `src/app/creators/[id]/page.tsx`・`src/app/creators/[id]/request/page.tsx`：支払い時期・手段をBadge表示
  - `src/app/creators/[id]/request/page.tsx`・`src/app/booking/complete/page.tsx`・`src/components/dashboard/BookingCard.tsx`：支払い条件の注意喚起文を表示（利用規約 第5条・第8条と整合。文言はその後「支払い条件など当事者での事前確認、合意をお願いします。」に変更、詳細は下記）
  - `CreatorCard.tsx`（一覧の小カード）には情報過多を避けるため支払いバッジは入れていない
- Heroセクションを大幅リニューアル・ブラウザ動作確認まで完了：
  - サブコピーを3行構成に変更（見出し・CTA2つ・強み3点は変更なし）
  - `HeroIllustration.tsx`：Creator/Userのアバターを`Avatar`の`src`指定で`public/images/hero/creator-avatar.png`・`user-avatar.png`（用意してもらったイラスト画像）に差し替え、サイズを`md`→`lg`に拡大。星評価バッジ（架空値・イメージ用の特例として追加）、中央の「申込み」「Discordで日時を調整」を吹き出し型（尻尾付き）に変更、Userカードのメッセージも吹き出し型に変更、薄紫のコントローラー等のアイコン背景装飾を追加。右下の「※画面はイメージです」の注記は不要と判断し削除
  - Hero下部の静的な4カテゴリ表示を、`GameCards.tsx`と同じビジュアル言語（カード型・ホバーで浮く・blob装飾）でリンク化。`categories`テーブルのslugを使い`/creators?category=slug`へ遷移（既存のCategorySearchFiltersの絞り込みにそのまま対応）。表示順を「一緒に遊ぶ／コーチング／VTuber交流／ランクアップ支援」に変更。カード上部に「カテゴリから探す」ラベル（GameCardsと同スタイル）を追加し、カード最小高さもGameCardsと統一（`min-h-[104px]`）
  - 役割が重複していた`TwoPillars.tsx`（推し活/コーチングの2本柱訴求）を削除し、`src/app/page.tsx`からも除去。役割はHero下部のカテゴリ帯に統合
  - `FeaturedCreators.tsx`の「すべて見る →」リンクを削除（重複導線の整理）
  - 「トップページ デザイン改善TODO」の「後回し」に記載していた「Heroのサンプルキャラのイメージ画像を魅力的に」は今回のアバター差し替えで対応完了
- 運営者からの指摘3件を修正・ビルド確認・push済み：
  - `HeroIllustration.tsx`のモバイル表示（`lg`未満）を、Creator/Userカードが縦一直線に並ぶ構成（Creator→矢印→マッチング成立円→矢印→User）から、両者が対等に歩み寄る構図に変更。CSS Grid（`grid-template-areas`で`"creator user" / "center center"`）でCreatorカードとUserカードを横並び2カラムにし、その下に「申込み→マッチング成立の円→Discordで調整」のブロックを配置。左右の矢印は横並び構図と噛み合わないため`hidden lg:flex`で`lg`以上のみ表示に。カード幅が半分になる分、Avatar・Badge・文字サイズ・余白をモバイル用に縮小し`lg:`＋`!important`で`lg`以上は元のサイズに復元（Avatar/Badgeが共通コンポーネントで固定サイズclassを持つため）。Grid子要素には`min-w-0`を付与（無いと2カラム時にカードが縮まず崩れるため必須）
  - 支払い条件の注意喚起文言を「支払い条件は当事者間で事前に合意してください。運営は金銭トラブルに関与しません。」→「支払い条件など当事者での事前確認、合意をお願いします。」に統一（`src/app/creators/[id]/request/page.tsx`・`src/app/booking/complete/page.tsx`・`src/components/dashboard/BookingCard.tsx`の3箇所）
  - Heroサブコピー（3行目まで`<br>`区切り）の折り返しが375px・414px幅で不自然だった問題を修正。まず該当pタグに`text-pretty`（Tailwind 3.4のcore utility）を適用したが、「見つかる」「交流」のような複合語・動詞が真っ二つに割れる箇所が残ったため、`「交流する。」「きっと見つかる。」`を`<span className="whitespace-nowrap">`で囲んで解消（`見つかる。`だけをnowrapにすると今度は「きっと」が割れたため、範囲を「きっと見つかる。」まで広げて対応）。375/414/640/768pxで再確認済み、崩れなし

## 次回やること
1. 【重要】Vercel（本番）の環境変数にADMIN_USER_IDが未追加。Production/Previewに追加しないと本番で管理者判定が効かず、誰も/adminにアクセスできない（＝常に404）、または設定ミス時に意図しないユーザーが管理者として扱われるリスクがあるため、pushとは別に必ず対応すること
2. 独自ドメイン取得＋Resendドメイン認証（本番で任意のCreatorのメール宛にも通知メールを届けるため。現状onboarding@resend.devのテスト送信元のため、Resendアカウント登録メール宛にしか届かない）
3. 本番での通知メール実受信テスト（前提としてVercel側の環境変数〔Production/Preview〕に SUPABASE_SERVICE_ROLE_KEY と RESEND_API_KEY を追加する作業も未実施）
4. 通報機能のブラウザ動作確認（通報フォームの表示・送信、自己通報が弾かれること、reports_not_self制約、Table Editorでの内容確認）が未実施
5. 規約同意チェックボックスのブラウザ動作確認（未チェック時disabled・案内表示、リンクが別タブで開くこと）が未実施
6. エラー処理の改善（まとまりA・Bとも実装済み）のブラウザ動作確認が未実施：404ページ、error.tsx（意図的にエラーを起こして確認する必要あり）、出品削除の確認ダイアログ、マイページのエラー表示、各loading.tsxの表示
7. /adminダッシュボードについて、別アカウント（管理者以外）でログインした場合に404になることの確認が未実施（管理者以外が見られないことの検証）
8. 申込通知メールの迷惑メール対策：申込通知メール（Creatorへの承認依頼）は正常に送信・deliveredされているが、Gmailの迷惑メールフォルダに入ることを確認。機能は正常だが、実運用ではCreatorが申込に気づけないリスクがある。対策：(1)DMARCレコードをDNSに追加する（SPF/DKIMはResend認証で設定済み、DMARCは未設定）(2)送信実績の蓄積でドメイン評判が上がれば徐々に改善。優先度：公開して実際にCreatorが使う前に、DMARC設定はやっておきたい

## トップページ デザイン改善TODO（運営者が画面確認して指摘、2AIも妥当と評価）

### 完了
- 重複Aの整理・2カードの入口ボタン化：「推し活」→`/creators?category=play_together,vtuber`、「コーチング」→`/creators?category=coaching,rank_up`に遷移する入口ボタン化。searchCreators/CreatorSearchFiltersをカンマ区切り複数カテゴリのOR絞り込みに対応拡張（既存の単一カテゴリ検索は非破壊）。下のFilterTabsはカテゴリタブ行を削除しゲーム別絞り込みのみに専念させ、役割重複を解消
- 2カード内に抽象装飾グラフィックを追加：右側の余白に、推し活＝ハート・星の暖色系グラデーション、コーチング＝上昇バー・成長矢印の寒色〜紫系グラデーションを薄いSVGで追加（白ベース・シンプルの方針は維持）
- 重複Bの整理：Heroの3点を「お得さ・始めやすさ」に純化（連絡先非公開を削除し「申込みもずっと無料・気軽に問い合わせOK」に差し替え）。下部の安全性セクションは「登録・申込は無料」を「通報機能で運営が対応」に差し替え、「安全・安心の詳細」に純化。「連絡先非公開」「登録無料」の重複を解消
- 「かんたん3ステップ」の命名変更：「ゲームを一緒に始めるまでの流れ」に変更
- ①ナビゲーション整理：ヘッダーから「受け取った申込」「申込状況」を削除し「マイページ」に集約。ヘッダーは「ご利用の流れ／よくある質問／安心して利用するために／Creatorを探す／マイページ」＋ログアウトのみのスッキリした構成に変更（Header.tsxのis_creator取得も不要になり削除）。代わりに/dashboard配下（profile/requests/my-requests共通）にDashboardTabs（マイページ／受け取った申込〔Creatorのみ〕／申込状況）を新設し、マイページ経由で辿れるように。ログイン時のみ表示・トップページには非露出の方針は維持
- ④ゲームから探す導線のカード化：小さなチップ形式（FilterTabs）を、ゲームごとに2〜3列のカードグリッド（GameCards.tsxにリネーム）に変更。カードに「ゲーム名」「Creator募集中」（実データが無いため数表示ではなくこの文言で代替）「矢印アイコン」を表示し、押すと`/creators?game=slug`へ絞り込み遷移（既存のsearchCreatorsのgame絞り込みは無改修）。ゲーム公式ロゴは使わず、TwoPillarsで使った抽象グラフィック（ゲームカラーのblob装飾）の手法を流用。白ベース・シンプルの方針は維持
- ⑤Creator登録UIの簡易化：マイページに特徴タグ（初心者歓迎／VCあり／雑談歓迎／エンジョイ勢／ガチ勢／深夜対応の6種）のチェックボックスを追加し、profiles.feature_tagsに保存（詳細な設計は上の「これまで完了したこと」参照）。CreatorCard・Creator詳細ページ・TOPページのFeaturedCreatorsにタグをBadge表示。自己紹介欄には「推し活系」「コーチング系」の例文を挿入するボタンを追加し、入力済みの場合は上書き前に確認を挟むようにした。実装過程で、FeaturedCreatorsが実Creatorにも一律「ボイスチャット対応」という固定タグを表示していた（実際の設定と無関係な表示だった）ことが判明し、実データのfeature_tagsに置き換えて解消済み
- ⑥Heroセクションの大幅リニューアル：サブコピー3行化、HeroIllustrationのアバターを架空イラスト画像に差し替え・拡大、下部の静的4カテゴリ表示をGameCards同様のカード型リンクに変更（表示順「一緒に遊ぶ／コーチング／VTuber交流／ランクアップ支援」）。役割が重複していたTwoPillars.tsxを削除し役割をこのカテゴリ帯に統合。FeaturedCreatorsの「すべて見る →」リンクも削除（詳細は上の「これまで完了したこと」参照）

### 後回し（優先度低）
- 運営者自身のプロフィール写真を設定（実Creatorカードの見栄え向上）

### 将来（実績が溜まってから）
- Creatorのレビュー・星評価機能。今は取引実績がほぼ無く表示が空になるため実装しない。それまでは「連絡先非公開・通報機能・サポート」等の仕組みによる安心の見せ方で信頼を担保

### 補足
- 「受け取った申込／申込状況」は本人だけが見るべき情報のため、非ログイン時・トップページには非露出（①の対応後は/dashboard配下のDashboardTabs経由でのみ表示。ヘッダー直置きはやめてマイページに集約した）

## 注意事項
- 独自ドメイン未取得。Resendはテストモードで、アカウント登録メール宛にしか送れない。公開前にドメイン取得＋Resendドメイン認証が必須
- Supabase無料プランは7日アクセスがないとプロジェクトが自動停止する
- スキーマ変更は「先にDBへSQL適用→その後コードpush」の順が安全
- トップの「あおい/ゆうき/みお」等はサンプルデータで実在Creatorではない
- 【重要】Vercel（本番）の環境変数にADMIN_USER_IDを追加する必要がある。未設定だと本番で管理者判定が効かず、誰も/adminにアクセスできない（またはコード次第では想定外の挙動になりうる）

## 教訓
セッションをまたぐ記録（NOTES.md等）は、作成指示だけでなくコミット・pushまで完了を必ず確認すること。
