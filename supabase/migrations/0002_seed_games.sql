-- =========================================================
-- GameMatch MVP - ゲームマスタの初期データ
-- Step6(検索機能)で実際に絞り込みを試せるよう、代表的なゲームを登録しておく。
-- Supabaseダッシュボード > SQL Editor で、0001_init.sqlの後にこの内容を実行してください。
-- 運用時はここに無いゲームを自由に追加・編集して構いません。
-- =========================================================

insert into games (name, slug, is_active) values
  ('Apex Legends', 'apex-legends', true),
  ('League of Legends', 'league-of-legends', true),
  ('VALORANT', 'valorant', true),
  ('Fortnite', 'fortnite', true),
  ('原神', 'genshin-impact', true),
  ('Minecraft', 'minecraft', true);
