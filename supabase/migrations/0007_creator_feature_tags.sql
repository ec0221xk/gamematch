-- =========================================================
-- GameMatch MVP - Creatorの特徴タグ(feature_tags)
-- Supabaseダッシュボード > SQL Editor に貼り付けて実行してください
-- (0001_init.sql の後、任意のタイミングで実行可)
-- =========================================================

-- profilesに特徴タグを追加。
-- 「初心者歓迎」「深夜対応」等はゲーム/カテゴリが変わっても基本的に一定の
-- Creator個人の属性のため、出品単位のcreator_gamesではなくprofilesに持たせる。
-- languages(text[] + GINインデックス)と同じ設計方針。
-- 値はslugで保存し、表示名(日本語ラベル)はアプリ側の定数で管理する
-- (categories/gamesと同じ考え方。文言だけ直したい場合にマイグレーション不要にするため)。
alter table profiles
  add column feature_tags text[] not null default '{}';

-- 選択肢を固定6種に制限する(creator_games.unitのcheck制約と同じ方針)。
-- 新しいタグを追加する場合はこの制約を更新するマイグレーションを追加すること。
alter table profiles
  add constraint profiles_feature_tags_check
  check (feature_tags <@ array[
    'beginner_friendly', -- 初心者歓迎
    'voice_chat_ok',     -- VC(ボイスチャット)あり
    'chat_welcome',       -- 雑談歓迎
    'casual',             -- エンジョイ勢(ゆるく楽しみたい人向け)
    'hardcore',           -- ガチ勢(本気で上達したい人向け)
    'late_night'          -- 深夜対応
  ]::text[]);

-- 将来の検索絞り込み(例: feature_tags @> array['voice_chat_ok'])に備えたGINインデックス。
create index idx_profiles_feature_tags on profiles using gin (feature_tags);
