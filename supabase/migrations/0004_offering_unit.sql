-- =========================================================
-- GameMatch MVP - 料金単位(unit)カラム追加
-- Supabaseダッシュボード > SQL Editor に貼り付けて実行してください
-- (0001_init.sql の後、任意のタイミングで実行可)
-- =========================================================

-- creator_gamesに料金の単位を追加。
-- 既存行はこれまでの表示("/ 1回")と同じ意味になるようデフォルト値'1回'を入れて後方互換を保つ。
alter table creator_games
  add column unit text not null default '1回';

-- OfferingFormのSelectで選ばせる4択のみを許可し、表記ゆれを防ぐ。
alter table creator_games
  add constraint creator_games_unit_check
  check (unit in ('1時間', '90分', '3試合', '1回'));
