-- =========================================================
-- GameMatch MVP - 支払い条件(payment_timing / payment_methods)
-- Supabaseダッシュボード > SQL Editor に貼り付けて実行してください
-- (0001_init.sql の後、任意のタイミングで実行可)
-- =========================================================

-- profiles: Creator個人の基本方針。出品側で上書きが無い場合のフォールバック値として使う。
-- 未記載でも申込自体は可能な任意項目のため、unitと違いNOT NULLにはしない。
alter table profiles
  add column payment_timing text,
  add column payment_methods text[] not null default '{}';

alter table profiles
  add constraint profiles_payment_timing_check
  check (payment_timing is null or payment_timing in ('prepay', 'postpay', 'negotiable'));

alter table profiles
  add constraint profiles_payment_methods_check
  check (payment_methods <@ array[
    'paypay',         -- PayPay(個人間送金)
    'bank_transfer',  -- 銀行振込
    'line_pay',       -- LINE Pay
    'wise',           -- Wise(海外送金)
    'other'           -- その他/応相談
  ]::text[]);

-- creator_games: 出品ごとの上書き。列が存在すること自体は同じで、
-- NULL/空配列の場合は「上書きなし」を意味し、profilesの値にフォールバックする
-- (アプリ側で解決。DB側にビュー等は作らない)。
alter table creator_games
  add column payment_timing text,
  add column payment_methods text[] not null default '{}';

alter table creator_games
  add constraint creator_games_payment_timing_check
  check (payment_timing is null or payment_timing in ('prepay', 'postpay', 'negotiable'));

alter table creator_games
  add constraint creator_games_payment_methods_check
  check (payment_methods <@ array[
    'paypay', 'bank_transfer', 'line_pay', 'wise', 'other'
  ]::text[]);
