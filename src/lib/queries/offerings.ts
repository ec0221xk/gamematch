import { createClient } from "@/lib/supabase/server";

export interface OfferingDetail {
  id: string; // creator_games.id
  creatorId: string;
  creatorName: string;
  creatorAvatarUrl: string | null;
  gameName: string;
  categoryId: number;
  categoryName: string;
  rank: string | null;
  price: number;
  unit: string;
  description: string | null;
}

type RawOfferingDetailRow = {
  id: string;
  rank: string | null;
  price: number;
  unit: string;
  description: string | null;
  category_id: number;
  creator: {
    id: string;
    display_name: string;
    profile_image_url: string | null;
  } | null;
  game: { name: string } | null;
  category: { name: string } | null;
};

/**
 * 申込フォーム(/creators/[id]/request)で、申込対象のサービス1件を取得する。
 * 1人のCreatorが複数のゲーム/カテゴリ/料金を提供できるため、
 * creator_games.id(offering)単位で取得する。
 */
export async function getOfferingDetail(
  offeringId: string,
): Promise<OfferingDetail | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("creator_games")
    .select(
      `id, rank, price, unit, description, category_id, creator:profiles(id, display_name, profile_image_url), game:games(name), category:categories(name)`,
    )
    .eq("id", offeringId)
    .single()
    .returns<RawOfferingDetailRow>();

  if (error || !data || !data.creator || !data.game || !data.category) {
    return null;
  }

  return {
    id: data.id,
    creatorId: data.creator.id,
    creatorName: data.creator.display_name,
    creatorAvatarUrl: data.creator.profile_image_url,
    gameName: data.game.name,
    categoryId: data.category_id,
    categoryName: data.category.name,
    rank: data.rank,
    price: data.price,
    unit: data.unit,
    description: data.description,
  };
}
