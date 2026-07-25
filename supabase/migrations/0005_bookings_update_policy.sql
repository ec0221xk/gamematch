-- =========================================================
-- GameMatch MVP - bookings UPDATE用RLSポリシー追加
-- Supabaseダッシュボード > SQL Editor に貼り付けて実行してください
-- (0001_init.sql の後、任意のタイミングで実行可)
-- =========================================================

-- Creatorが受け取った申込を承認/辞退できるようにする。
-- 対象はまだ結果が出ていない(pending)自分宛ての申込のみに限定し、
-- 更新後のstatusもaccepted/declinedのみを許可することで、
-- 承認済み/辞退済みの申込を後から書き換えたり、
-- completed/pendingへ不正に戻したりできないようにする。
create policy "bookings_update_creator" on bookings for update
  using (auth.uid() = creator_id and status = 'pending')
  with check (auth.uid() = creator_id and status in ('accepted', 'declined'));
