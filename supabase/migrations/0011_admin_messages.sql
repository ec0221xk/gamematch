-- =========================================================
-- GameMatch MVP - 運営からのメッセージ機能(admin_messages)
-- Supabaseダッシュボード > SQL Editor に貼り付けて実行してください
-- (0001_init.sql の後、任意のタイミングで実行可)
-- =========================================================

-- 運営(=ADMIN_USER_ID)とユーザー(Creator/Player)の間の連絡専用メッセージ。
-- Creator↔Player間の汎用チャットではないため、スレッドは「1ユーザーにつき1本」に固定し、
-- 別途threadsテーブルは作らずuser_idで表現する(運営は常に単一アカウントのため)。
create table admin_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  -- true: 運営→ユーザー, false: ユーザー→運営(返信)
  sender_is_admin boolean not null,
  body text not null check (char_length(body) > 0),
  -- 受信側の既読フラグ。sender_is_admin=trueの行は「ユーザーが読んだか」、
  -- falseの行は「運営が読んだか」を表す(1カラムで双方向をカバーする)。
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- スレッド表示(user_id絞り込み + 時系列ソート)用
create index idx_admin_messages_user_id_created_at
  on admin_messages(user_id, created_at);

-- 管理画面側で「ユーザーからの未読返信」を横断集計する際に使う
create index idx_admin_messages_unread_from_user
  on admin_messages(sender_is_admin, is_read)
  where sender_is_admin = false and is_read = false;

-- =========================================================
-- Row Level Security
-- =========================================================
alter table admin_messages enable row level security;

-- select: 自分宛てのスレッド(運営からのメッセージ+自分の返信)のみ閲覧可
create policy "admin_messages_select_own" on admin_messages for select
  using (auth.uid() = user_id);

-- insert: ユーザーは自分の返信のみ作成可能。sender_is_admin=trueでの挿入は
-- withチェックにより拒否されるため、運営へのなりすましはできない。
-- 運営からの送信はservice roleクライアント(RLSバイパス)経由でのみ行う。
create policy "admin_messages_insert_own_reply" on admin_messages for insert
  with check (auth.uid() = user_id and sender_is_admin = false);

-- update: ユーザーは自分宛て(運営から)のメッセージの既読フラグのみ更新可能。
-- bookings_update_creator(0005)と同様、列単位の厳密な制限は行わず行単位の制約に留める
-- (アプリ側は is_read のみを送るため実運用上のリスクは低いと判断)。
create policy "admin_messages_update_mark_read" on admin_messages for update
  using (auth.uid() = user_id and sender_is_admin = true)
  with check (auth.uid() = user_id and sender_is_admin = true);

-- delete/運営用ポリシーは追加しない(reportsテーブルと同じ方針)。
-- 運営側の閲覧・送信・既読更新はすべてservice roleクライアント(createAdminClient)経由で行い、
-- RLSをバイパスする前提(呼び出し側でADMIN_USER_IDとの一致確認済み)。
