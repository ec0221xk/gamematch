# GameMatch

ゲームが得意な人がスキルや時間を収益化できるプラットフォーム「GameMatch」のMVPです。

> このREADMEは実装が進むたびに更新されます。要件定義にあった全Stepの実装が完了し、現在は仕上げ(本ステップ)の状態です。

## このプロジェクトについて

- 一緒に遊びたい人と、ゲームが得意な人(VTuber・配信者・女性ゲーマー・高ランカー)をつなぐマッチングサービスです。
- 決済機能はMVPには含まれません。ユーザーはCreatorへ「依頼」を送信し、その後の連絡はDiscord等で行う想定です。

### このMVPに含まれない機能(意図的に対象外)

- 決済・Stripe連携
- チャット機能
- レビュー機能
- 通知機能(メール・プッシュ通知など)
- 管理画面
- 予約(空き時間)システム
- スマートフォンアプリ化

これらは将来的な拡張候補です。DB設計(`creator_games`と`profiles`の分離、`bookings`への料金スナップショット保存など)は、こうした拡張を見据えて行っています。

## 技術スタック

| 項目 | 採用技術 |
|---|---|
| フロントエンド | Next.js (App Router) + TypeScript |
| スタイリング | Tailwind CSS |
| バックエンド/DB | Supabase (PostgreSQL, Auth) |
| ホスティング | Vercel |

## 現在の進捗

- [x] Step1: プロジェクトの土台作成
- [x] Step2: Supabase連携設定・DBマイグレーション
- [x] Step3: 共通UIコンポーネント
- [x] Step4: 認証(会員登録・ログイン・ログアウト)
- [x] Step5: TOPページ
- [x] Step6: Creator一覧・検索
- [x] Step7: Creator詳細
- [x] Step8: 申込フォーム・申込完了画面
- [x] Step9: Creatorプロフィール編集(マイページ)
- [x] 仕上げ: セットアップ手順・Vercelデプロイ手順の最終確認(本ステップ)

## 動作環境

- Node.js 18.18以降(推奨: 20系)
- npm(Node.jsに同梱)

Node.jsが入っているか確認する方法(ターミナル/コマンドプロンプトで実行):

```bash
node -v
```

バージョン番号(例: `v20.15.0`)が表示されればOKです。表示されない場合は [https://nodejs.org](https://nodejs.org) から「LTS」版をダウンロードしてインストールしてください。

## Supabaseのセットアップ(初回のみ)

GameMatchはデータベースと認証にSupabaseというサービスを使います。以下の手順で無料のプロジェクトを作成してください。

### 1. Supabaseのアカウント作成・プロジェクト作成

1. [https://supabase.com](https://supabase.com) にアクセスし、GitHubアカウント等で新規登録します。
2. 「New project」をクリックし、プロジェクト名(例: `gamematch`)とデータベースのパスワードを設定して作成します。作成完了まで1〜2分かかります。

### 2. テーブルを作成する(マイグレーションの実行)

1. 作成したプロジェクトの左メニューから「SQL Editor」を開きます。
2. 「New query」をクリックし、このプロジェクト内の `supabase/migrations/0001_init.sql` の内容を全てコピー&ペーストします。
3. 右下の「Run」(または `Ctrl/Cmd + Enter`)を押して実行します。「Success」と表示されればテーブルの作成は完了です。
4. 同じ手順で `supabase/migrations/0002_seed_games.sql` も実行してください(検索で使う代表的なゲームの初期データが登録されます)。

### 3. 接続情報を取得する

1. 左メニューの「Project Settings」→「API」を開きます。
2. 「Project URL」と「anon public」というキーをそれぞれコピーします。

### 4. .env.localファイルを作成する

プロジェクトのフォルダ直下にある `.env.local.example` をコピーして `.env.local` という名前のファイルを作成し、先ほど取得した値を貼り付けます。

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=コピーしたProject URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=コピーしたanon publicキー
```

`.env.local` はパスワードと同じ重要な情報なので、GitHubなどに公開しないよう注意してください(`.gitignore`で既に除外設定済みです)。

### 5. メール確認(Confirm email)をOFFにする

MVPでは「登録したらすぐ使える」ことを優先するため、確認メールのクリックを必須にしない設定にします。

1. 左メニューの「Authentication」→「Providers」→「Email」を開きます。
2. 「Confirm email」のスイッチをOFFにして保存します。

この設定をOFFにしておくと、会員登録した直後にログイン状態になり、プロフィール情報もすぐに作成されます。ONのままにしておきたい場合は、登録後に届く確認メールのリンクをクリックしてからログインする必要があります(その場合もアプリは動作しますが、登録直後にプロフィールが自動作成されない点だけ異なります)。

## セットアップ手順

### 1. ファイルを展開する

ダウンロードしたzipファイルを、作業しやすい場所(例: デスクトップ)に展開(解凍)してください。

### 2. ターミナルでフォルダに移動する

Mac: 「ターミナル」アプリを開く
Windows: 「コマンドプロンプト」または「PowerShell」を開く

```bash
cd gamematch
```

(展開した場所によってパスは変わります)

### 3. 必要なパッケージをインストールする

```bash
npm install
```

インターネット経由で必要なライブラリがダウンロードされます。数十秒〜数分かかります。

### 4. Supabaseと接続する

上の「Supabaseのセットアップ」を参考に `.env.local` を作成してください。まだの場合はここで行ってください。

### 5. 開発用サーバーを起動する

```bash
npm run dev
```

「Local: http://localhost:3000」のような表示が出たら成功です。ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、GameMatchのTOPページが表示されます。

停止する場合はターミナルで `Ctrl + C` を押してください。

## 動作確認チェックリスト

実際にひと通りの流れを試して、正しく動いているか確認しましょう。

1. **会員登録**: TOPページの「Creatorとして登録」からメールアドレス・パスワード・表示名で登録する。登録後、ヘッダーが「マイページ / ログアウト」に変わればOK。
2. **サービスを追加する**: ヘッダーの「マイページ」を開き、「新しいサービスを追加」でゲーム・カテゴリ・料金を入力して「追加する」を押す。「提供しているサービス」の見出しに「Creator」バッジが表示されればOK。
3. **検索で見つかる**: 一度ログアウトするか、別のブラウザ(またはシークレットウィンドウ)で `/creators` を開き、先ほど追加したゲームで検索して自分のカードが表示されることを確認する。
4. **Creator詳細から申込む**: カードをクリックして詳細ページを開き、「申込する」から申込フォームを送信する。未ログインの場合はログイン画面に飛ばされ、ログイン後に同じフォームへ戻ってくることも確認する。
5. **申込完了画面が表示される**: 送信後に「送信が完了しました」という画面が表示されればOK。

ここまで一通り確認できれば、MVPとして必要な機能はすべて動作しています。

## Vercelデプロイ手順

作成したアプリを、誰でもアクセスできる本番URLとして公開する手順です。

### 1. GitHubにコードを置く

Vercelは基本的にGitHubと連携してデプロイします。

1. [https://github.com](https://github.com) でアカウントを作成し、「New repository」で新しいリポジトリ(例: `gamematch`)を作成します(Public・Privateどちらでも構いません)。
2. ターミナルでプロジェクトのフォルダに移動し、以下を順番に実行します。`<リポジトリのURL>` は、作成したリポジトリのページに表示される `https://github.com/(あなたのアカウント名)/gamematch.git` のようなURLに置き換えてください。

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <リポジトリのURL>
git push -u origin main
```

gitが入っていない場合は [https://git-scm.com/downloads](https://git-scm.com/downloads) からインストールしてください。ターミナル操作が不安な場合は、[GitHub Desktop](https://desktop.github.com) というアプリを使うと、ボタン操作だけでアップロードできます。

### 2. Vercelでプロジェクトをインポートする

1. [https://vercel.com](https://vercel.com) にアクセスし、GitHubアカウントでログインします。
2. 「Add New」→「Project」を選び、先ほど作成したGitHubリポジトリを選んで「Import」します。
3. 「Framework Preset」は自動的に「Next.js」と認識されるので、設定はそのままで構いません。

### 3. 環境変数を設定する

「Environment Variables」の入力欄に、`.env.local` と同じ内容を1つずつ追加します。

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseのProject URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabaseのanon publicキー |

### 4. デプロイする

「Deploy」ボタンを押すとビルドが始まります。1〜2分待つと、`https://(プロジェクト名).vercel.app` のようなURLでアプリが公開されます。

### 5. SupabaseのSite URLを更新する(推奨)

将来パスワード再設定機能などを使う場合に備えて、本番URLを登録しておきます。

1. Supabaseダッシュボードの「Authentication」→「URL Configuration」を開きます。
2. 「Site URL」を、Vercelで発行された本番URL(`https://(プロジェクト名).vercel.app`)に変更して保存します。

### コードを更新したいとき

ファイルを編集した後、以下を実行するだけでVercelが自動的に再デプロイします。

```bash
git add .
git commit -m "更新内容"
git push
```
