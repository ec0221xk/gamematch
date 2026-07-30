export interface CreatorTagOption {
  slug: string;
  label: string;
}

/**
 * profiles.feature_tags(text[])に保存する値の一覧。
 * DBにはslugで保存し、表示名はここで一元管理する
 * (文言だけ直したい場合にマイグレーション不要にするため)。
 * 選択肢を追加する場合は、supabase/migrations側のcheck制約も更新すること。
 */
export const CREATOR_TAGS: CreatorTagOption[] = [
  { slug: "beginner_friendly", label: "初心者歓迎" },
  { slug: "voice_chat_ok", label: "VC(ボイスチャット)あり" },
  { slug: "chat_welcome", label: "雑談歓迎" },
  { slug: "casual", label: "エンジョイ勢" },
  { slug: "hardcore", label: "ガチ勢" },
  { slug: "late_night", label: "深夜対応" },
];

export function getCreatorTagLabel(slug: string): string {
  return CREATOR_TAGS.find((tag) => tag.slug === slug)?.label ?? slug;
}
