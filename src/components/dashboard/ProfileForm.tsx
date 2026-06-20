"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, Textarea } from "@/components/ui";

interface ProfileFormProps {
  initialValues: {
    displayName: string;
    bio: string;
    discordId: string;
    country: string;
    languages: string[];
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      })
      .eq("id", user.id);

    if (updateError) {
      setError(`保存に失敗しました: ${updateError.message}`);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
