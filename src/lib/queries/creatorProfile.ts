import { createClient } from "@/lib/supabase/server";

export interface CreatorOffering {
  id: string; // creator_games.id (申込フォームへのリンクに使用)
  gameName: string;
  categoryName: string;
  rank: string | null;
  price: number;
  unit: string;
  description: string | null;
}

export interface CreatorProfile {
  id: string;
  displayName: string;
  bio: string | null;
  discordId: string | null;
  avatarUrl: string | null;
  country: string | null;
  languages: string[];
  completedCount: number;
  offerings: CreatorOffering[];
}

type RawOfferingRow = {
  id: string;
  rank: string | null;
  price: number;
  unit: string;
  description: string | null;
  game: { name: string } | null;
  category: { name: string } | null;
};

/**
 * Creator詳細ページ(/creators/[id])で使う取得関数。
 * 対象profilesが存在しない場合はnullを返す(呼び出し側でnotFound()する)。
 */
export async function getCreatorProfile(
  creatorId: string,
): Promise<CreatorProfile | null> {
  const supabase = createClient();

  const [profileResult, offeringsResult, statsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, display_name, bio, discord_id, profile_image_url, country, languages",
      )
      .eq("id", creatorId)
      .single(),
    supabase
      .from("creator_games")
      .select(
        "id, rank, price, unit, description, game:games(name), category:categories(name)",
      )
      .eq("creator_id", creatorId)
      .order("created_at", { ascending: false })
      .returns<RawOfferingRow[]>(),
    supabase
      .from("creator_stats")
      .select("completed_count")
      .eq("creator_id", creatorId)
      .maybeSingle(),
  ]);

  if (profileResult.error || !profileResult.data) {
    return null;
  }

  const profile = profileResult.data;
  const offerings = offeringsResult.data ?? [];

  return {
    id: profile.id,
    displayName: profile.display_name,
    bio: profile.bio,
    discordId: profile.discord_id,
    avatarUrl: profile.profile_image_url,
    country: profile.country,
    languages: profile.languages,
    completedCount: statsResult.data?.completed_count ?? 0,
    offerings: offerings.map((row) => ({
      id: row.id,
      gameName: row.game?.name ?? "",
      categoryName: row.category?.name ?? "",
      rank: row.rank,
      price: row.price,
      unit: row.unit,
      description: row.description,
    })),
  };
}
