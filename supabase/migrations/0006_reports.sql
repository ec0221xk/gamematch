-- =========================================================
-- GameMatch MVP - 通報(report)機能
-- Supabaseダッシュボード > SQL Editor に貼り付けて実行してください
-- (0001_init.sql の後、任意のタイミングで実行可)
-- =========================================================

-- enum型(bookings.statusと同じ方針で、固定4値をenumとして定義)
create type report_reason as enum (
  'inappropriate_behavior', -- 不適切な言動
  'solicitation',           -- 出会い目的
  'fraud',                  -- 詐欺・金銭トラブル
  'other'                   -- その他
);

-- reports（ユーザーによるCreator通報。reporter/reported_userともprofilesを参照。
-- profiles.idはauth.users.idと1:1のため、bookingsのuser_id/creator_idと同じ方針でprofiles参照にしている）
create table reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  reported_user_id uuid not null references profiles(id) on delete cascade,
  reason report_reason not null,
  detail text,
  created_at timestamptz not null default now(),
  constraint reports_not_self check (reporter_id <> reported_user_id)
);

-- インデックス
create index idx_reports_reporter_id on reports(reporter_id);
create index idx_reports_reported_user_id on reports(reported_user_id);

-- =========================================================
-- Row Level Security
-- =========================================================
alter table reports enable row level security;

-- insert: ログインユーザーが自分をreporter_idとして通報を作成できる。
-- 自己通報はRLSだけでなくテーブルのcheck制約(reports_not_self)でも防止しているため、
-- 万一クライアント側の検証をすり抜けてもDBレベルで弾かれる。
create policy "reports_insert_own" on reports for insert
  with check (auth.uid() = reporter_id);

-- select: あえてポリシーを作成しない(=通常のユーザーは誰の通報も一切読めない)。
-- 理由:
--   - 運営確認はSupabaseダッシュボードのTable Editor(postgresロール)や
--     service roleクライアントから行う前提であり、これらはRLSを経由しない/バイパスするため
--     クライアント向けのSELECTポリシーが無くても運営の閲覧には支障がない。
--   - 「自分が出した通報だけ見える」ポリシー(reporter_id = auth.uid())を追加する選択肢もあるが、
--     MVP段階では通報一覧UIを作らないため不要と判断し、まずは最も安全な「全面非公開」にしている。
--     将来「自分の通報履歴」画面を作る場合は下記を追加すればよい:
--       create policy "reports_select_own" on reports for select
--         using (auth.uid() = reporter_id);
--   - 被通報者(reported_user_id)からのSELECTは意図的に許可しない
--     (誰が自分を通報したか本人に分かってしまうと、通報者への報復や
--     通報自体をためらわせるリスクがあるため)。

-- update/deleteのポリシーも作成しない(クライアントからの通報の書き換え・削除は一切不可。
-- 修正が必要な場合は運営がTable Editor/service role経由で対応する想定)。
