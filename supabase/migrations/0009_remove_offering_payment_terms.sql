-- =========================================================
-- GameMatch MVP - 出品ごとの支払い条件の廃止(プロフィール側に一本化)
-- Supabaseダッシュボード > SQL Editor に貼り付けて実行してください
-- (0008_payment_terms.sql の後)
-- =========================================================

-- 出品(creator_games)ごとに支払い条件を変える運用ニーズが無いと判断したため、
-- 上書き用カラムを廃止し、profiles側の設定のみを使う方式に一本化する。
-- check制約(creator_games_payment_timing_check / creator_games_payment_methods_check)は
-- 当該カラムのみを参照しているため、DROP COLUMNで自動的に削除される(CASCADE不要)。
alter table creator_games
  drop column if exists payment_timing,
  drop column if exists payment_methods;
