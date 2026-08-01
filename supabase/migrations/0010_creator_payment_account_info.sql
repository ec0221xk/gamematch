-- =========================================================
-- GameMatch MVP - 振込先情報(creator_payment_account_info)
-- Supabaseダッシュボード > SQL Editor に貼り付けて実行してください
-- (0001_init.sql の後、任意のタイミングで実行可)
-- =========================================================

-- profilesとは別テーブルにする理由：profilesは"profiles_select_all" using (true)で
-- 全カラムが誰でも閲覧可能なため、同テーブルに機微情報(振込先)を追加すると
-- RLSで保護できない。振込先情報は「Creator本人 or 承認済みbookingの相手」だけに
-- 閲覧を絞る必要があるため、専用テーブル+専用RLSとして切り出す。
create table creator_payment_account_info (
  creator_id uuid primary key references profiles(id) on delete cascade,
  payment_account_info text,
  updated_at timestamptz not null default now()
);

alter table creator_payment_account_info enable row level security;

-- 閲覧：Creator本人、または当該Creatorとの承認済み(accepted/completed)bookingを持つPlayerのみ。
-- サブクエリはbookings自体のRLS(bookings_select_related: auth.uid() = user_id or creator_id)とも整合する
-- (ここで許可する行は、bookings側のRLSでも同じユーザーが閲覧可能な行と一致するため矛盾しない)。
create policy "payment_account_info_select_own_or_matched"
  on creator_payment_account_info for select
  using (
    auth.uid() = creator_id
    or exists (
      select 1 from bookings b
      where b.creator_id = creator_payment_account_info.creator_id
        and b.user_id = auth.uid()
        and b.status in ('accepted', 'completed')
    )
  );

-- 書き込み(insert/update/delete)はCreator本人のみ。
create policy "payment_account_info_modify_own"
  on creator_payment_account_info for all
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);
