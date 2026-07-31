"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, Button, Input, Select, Textarea } from "@/components/ui";
import { toUserErrorMessage } from "@/lib/utils/errorMessage";
import { CREATOR_TAGS } from "@/lib/constants/creatorTags";
import {
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_TIMING_OPTIONS,
} from "@/lib/constants/paymentTerms";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];

const BIO_TEMPLATES = [
  {
    key: "oshikatsu",
    label: "推し活系の例文",
    text: "ゲームが大好きで、初心者さんも大歓迎です！一緒にわいわい楽しく遊びましょう。得意なゲームは〇〇、プレイスタイルは△△な感じです。気軽に話しかけてください。",
  },
  {
    key: "coaching",
    label: "コーチング系の例文",
    text: "〇〇(ゲーム名)を中心に、ランク〇〇帯で活動しています。初心者〜中級者の方向けに、立ち回りやエイムなど丁寧にサポートします。まずはお気軽にご相談ください！",
  },
];

interface ProfileFormProps {
  initialValues: {
    displayName: string;
    bio: string;
    discordId: string;
    country: string;
    languages: string[];
    featureTags: string[];
    paymentTiming: string | null;
    paymentMethods: string[];
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
  const [featureTags, setFeatureTags] = useState<string[]>(
    initialValues.featureTags,
  );
  const [paymentTiming, setPaymentTiming] = useState(
    initialValues.paymentTiming ?? "",
  );
  const [paymentMethods, setPaymentMethods] = useState<string[]>(
    initialValues.paymentMethods,
  );
  const [pendingTemplateKey, setPendingTemplateKey] = useState<string | null>(
    null,
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

  function toggleFeatureTag(slug: string) {
    setFeatureTags((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  function togglePaymentMethod(slug: string) {
    setPaymentMethods((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  function applyTemplate(template: (typeof BIO_TEMPLATES)[number]) {
    setBio(template.text);
    setPendingTemplateKey(null);
  }

  function handleTemplateClick(template: (typeof BIO_TEMPLATES)[number]) {
    if (bio.trim().length === 0) {
      applyTemplate(template);
      return;
    }
    setPendingTemplateKey(template.key);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
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
          setError(
            toUserErrorMessage(uploadError, "ProfileForm: avatar upload failed"),
          );
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
          feature_tags: featureTags,
          payment_timing: paymentTiming || null,
          payment_methods: paymentMethods,
          profile_image_url: avatarUrl,
        })
        .eq("id", user.id);

      if (updateError) {
        setError(toUserErrorMessage(updateError, "ProfileForm: profile update failed"));
        setIsLoading(false);
        return;
      }

      setAvatarFile(null);
      setSuccess(true);
      setIsLoading(false);
      router.refresh();
    } catch (err) {
      setError(toUserErrorMessage(err, "ProfileForm: unexpected error"));
      setIsLoading(false);
    }
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
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-sm font-medium text-gray-700">自己紹介</label>
          <div className="flex gap-3">
            {BIO_TEMPLATES.map((template) => (
              <button
                key={template.key}
                type="button"
                onClick={() => handleTemplateClick(template)}
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                {template.label}を挿入
              </button>
            ))}
          </div>
        </div>
        {pendingTemplateKey && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <span>入力済みの自己紹介を例文で置き換えます。よろしいですか？</span>
            <button
              type="button"
              onClick={() =>
                applyTemplate(
                  BIO_TEMPLATES.find((t) => t.key === pendingTemplateKey)!,
                )
              }
              className="font-medium underline"
            >
              置き換える
            </button>
            <button
              type="button"
              onClick={() => setPendingTemplateKey(null)}
              className="text-amber-700 underline"
            >
              キャンセル
            </button>
          </div>
        )}
        <Textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="得意なゲームや、対応できる時間帯などを書きましょう。"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-700">
          特徴タグ(複数選択可)
        </p>
        <div className="flex flex-wrap gap-2">
          {CREATOR_TAGS.map((tag) => {
            const checked = featureTags.includes(tag.slug);
            return (
              <label
                key={tag.slug}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  checked
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFeatureTag(tag.slug)}
                  className="sr-only"
                />
                {tag.label}
              </label>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Select
          label="支払い時期(任意)"
          placeholder="未設定"
          options={PAYMENT_TIMING_OPTIONS.map((option) => ({
            label: option.label,
            value: option.slug,
          }))}
          value={paymentTiming}
          onChange={(event) => setPaymentTiming(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-700">
          支払い手段(複数選択可)
        </p>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHOD_OPTIONS.map((option) => {
            const checked = paymentMethods.includes(option.slug);
            return (
              <label
                key={option.slug}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  checked
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePaymentMethod(option.slug)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input
            label="Discord ID"
            value={discordId}
            onChange={(event) => setDiscordId(event.target.value)}
            placeholder="例: aoi#1234"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            承認後、マッチングした相手に表示されます。
          </p>
        </div>
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
