-- =========================================================
-- GameMatch MVP - プロフィール画像用Storageバケット
-- Supabaseダッシュボード > SQL Editor に貼り付けて実行してください
-- (0001_init.sql の後、任意のタイミングで実行可。バケット作成もダッシュボードのStorage画面ではなくこのSQLで行う)
-- =========================================================

-- avatarsバケット(公開・2MB制限・画像のみ)
-- profilesは既に誰でも閲覧可能(profiles_select_all)なため、画像も公開バケットとして扱う。
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- =========================================================
-- Row Level Security (storage.objects)
-- ファイルパスは avatars/{user_id}/{timestamp}.{ext} を前提とし、
-- パス先頭フォルダ = auth.uid() の場合のみ本人が書き込み・削除できるようにする。
-- =========================================================
alter table storage.objects enable row level security;

drop policy if exists "avatars_select_all" on storage.objects;
create policy "avatars_select_all" on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own" on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own" on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
