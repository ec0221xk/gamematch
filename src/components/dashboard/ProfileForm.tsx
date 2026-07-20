"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, Button, Input, Textarea } from "@/components/ui";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];

interface ProfileFormProps {
  initialValues: {
    displayName: string;
    bio: string;
    discordId: string;
    country: string;
    languages: string[];
    avatarUrl: string | null;
  };
}

/**
 * profiles.languagesはtext[]だが、入力UIを複雑にしないため
 * 「カンマ区切りのテキスト」として入力・保存時に配列へ変換する。
 */
export function ProfileForm({ initialValues }: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState(initialValues.displayName);
  const [bio, setBio] = useState(initialValues.bio);
  const [discordId, setDiscordId] = useState(initialValues.discordId);
  const [country, setCountry] = useState(initialValues.country);
  const [languages, setLanguages] = useState(
    initialValues.languages.join(", "),
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(
    initialValues.avatarUrl,
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setError("画像形式はPNG・JPEG・WebPのいずれかを選択してください。");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError("画像サイズは2MB以内にしてください。");
      event.target.value = "";
      return;
    }

    setError(null);
    setAvatarFile(file);
    setAvatarPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("ログイン状態を確認できませんでした。再度ログインしてください。");
      setIsLoading(false);
      return;
    }

    let avatarUrl = initialValues.avatarUrl;

    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { contentType: avatarFile.type });

      if (uploadError) {
        setError(`画像のアップロードに失敗しました: ${uploadError.message}`);
        setIsLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);
      avatarUrl = publicUrl;
    }

    const languageList = languages
      .split(",")
      .map((lang) => lang.trim())
      .filter(Boolean);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        bio: bio.trim() || null,
        discord_id: discordId.trim() || null,
        country: country.trim() || null,
        languages: languageList,
        profile_image_url: avatarUrl,
      })
      .eq("id", user.id);

    if (updateError) {
      setError(`保存に失敗しました: ${updateError.message}`);
      setIsLoading(false);
      return;
    }

    setAvatarFile(null);
    setSuccess(true);
    setIsLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar src={avatarPreviewUrl} alt={displayName || "avatar"} size="lg" />
        <div>
          <label className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            画像を選択
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
          <p className="mt-1 text-xs text-gray-400">PNG・JPEG・WebP / 2MBまで</p>
        </div>
      </div>
      <Input
        label="表示名"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
        required
      />
      <Textarea
        label="自己紹介"
        value={bio}
        onChange={(event) => setBio(event.target.value)}
        placeholder="得意なゲームや、対応できる時間帯などを書きましょう。"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Discord ID"
          value={discordId}
          onChange={(event) => setDiscordId(event.target.value)}
          placeholder="例: aoi#1234"
        />
        <Input
          label="国"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          placeholder="例: 日本"
        />
      </div>
      <Input
        label="対応言語(カンマ区切り)"
        value={languages}
        onChange={(event) => setLanguages(event.target.value)}
        placeholder="例: 日本語, English"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-brand-700">保存しました。</p>}
      <Button type="submit" isLoading={isLoading} className="self-start">
        保存する
      </Button>
    </form>
  );
}
