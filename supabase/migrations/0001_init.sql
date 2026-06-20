-- =========================================================
-- GameMatch MVP - 初期マイグレーション
-- 承認済み最終設計(is_creator方式 / languages text[] / 実績集計ビュー含む)
-- Supabaseダッシュボード > SQL Editor に貼り付けて実行してください
-- =========================================================

-- 拡張機能
create extension if not exists "uuid-ossp";

-- enum型
-- user_role enumは採用しない: CreatorとUserは排他的な属性ではなく、
-- 「creator_gamesにそのユーザーの行が存在するか」で実質的に判定する。
-- is_creatorはUI表示を簡単にするための補助フラグ。
create type booking_status as enum ('pending', 'accepted', 'declined', 'completed');

-- profiles（auth.usersと1:1。会員登録時にトリガーで自動作成する想定）
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_creator boolean not null default false,
  display_name text not null,
  bio text,
  discord_id text,
  profile_image_url text,
  country text,
  languages text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- games（将来の複数ゲーム対応のためprofilesから分離）
create table games (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- categories（固定4カテゴリ。マスタ化し将来追加可能に）
create table categories (
  id serial primary key,
  slug text not null unique,
  name text not null
);

-- creator_games（Creator × ゲーム × カテゴリ × 料金の組み合わせ）
-- 「誰がどのゲームでCreatorとして活動しているか」はこのテーブルの存在そのもので表現される
create table creator_games (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid not null references profiles(id) on delete cascade,
  game_id uuid not null references games(id) on delete cascade,
  category_id integer not null references categories(id),
  rank text,
  price integer not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (creator_id, game_id, category_id)
);

-- bookings（依頼。料金・カテゴリをスナップショットとして保持し将来の分析に利用）
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  creator_id uuid not null references profiles(id) on delete cascade,
  creator_game_id uuid not null references creator_games(id),
  category_id integer not null references categories(id),
  price integer not null,
  message text,
  status booking_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- creator_gamesに最初の行が追加された時点で、profiles.is_creatorを自動的にtrueにする
-- (アプリ側で都度更新する必要をなくし、表示用フラグの整合性を保つ)
create or replace function set_is_creator()
returns trigger as $$
begin
  update profiles
  set is_creator = true, updated_at = now()
  where id = new.creator_id and is_creator = false;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_set_is_creator
after insert on creator_games
for each row execute function set_is_creator();

-- インデックス
create index idx_creator_games_creator_id on creator_games(creator_id);
create index idx_creator_games_game_id on creator_games(game_id);
create index idx_creator_games_category_id on creator_games(category_id);
create index idx_bookings_creator_id on bookings(creator_id);
create index idx_bookings_user_id on bookings(user_id);
create index idx_bookings_category_id on bookings(category_id);
create index idx_games_is_active on games(is_active);
create index idx_profiles_languages on profiles using gin (languages);

-- カテゴリ初期データ(固定4種)
insert into categories (slug, name) values
  ('play_together', '一緒に遊ぶ'),
  ('coaching', 'コーチング'),
  ('rank_up', 'ランクアップ支援'),
  ('vtuber', 'VTuber交流');

-- 実績件数集計用ビュー(Creator詳細画面で使用)
create view creator_stats as
select
  creator_id,
  count(*) filter (where status = 'completed') as completed_count
from bookings
group by creator_id;

-- =========================================================
-- Row Level Security
-- =========================================================
alter table profiles enable row level security;
alter table games enable row level security;
alter table categories enable row level security;
alter table creator_games enable row level security;
alter table bookings enable row level security;

-- profiles: 閲覧は全員可、作成・更新は本人のみ
create policy "profiles_select_all" on profiles for select using (true);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- games: 公開中のゲームは誰でも見える。ログインユーザーは非公開のものも見える(管理用途)
create policy "games_select_all" on games for select using (is_active = true or auth.uid() is not null);
create policy "categories_select_all" on categories for select using (true);

-- creator_games: 閲覧は全員可、作成・更新・削除はCreator本人のみ
create policy "creator_games_select_all" on creator_games for select using (true);
create policy "creator_games_modify_own" on creator_games for all
  using (auth.uid() = creator_id) with check (auth.uid() = creator_id);

-- bookings: 申込者本人 or 対象Creator本人のみ閲覧可、作成は申込者本人のみ
create policy "bookings_select_related" on bookings for select
  using (auth.uid() = user_id or auth.uid() = creator_id);
create policy "bookings_insert_own" on bookings for insert
  with check (auth.uid() = user_id);
