import { createClient } from "@/lib/supabase/server";

export interface CreatorCardData {
  id: string; // creator_games.id (React keyなどに使用)
  creatorId: string; // profiles.id (Creator詳細ページへのリンクに使用)
  displayName: string;
  avatarUrl: string | null;
  gameName: string;
  rank: string | null;
  price: number;
  unit: string;
  categoryName: string;
}

type RawCreatorGameRow = {
  id: string;
  rank: string | null;
  price: number;
  unit: string;
  creator: {
    id: string;
    display_name: string;
    profile_image_url: string | null;
  } | null;
  game: { name: string; slug: string } | null;
  category: { name: string; slug: string } | null;
};

// game/categoryはNOT NULLな外部キーのため、!innerを付けても本来除外される行は無い。
// 検索条件(game.slug / category.slug)で絞り込むためにこの結合方法を使う。
const CREATOR_GAME_SELECT = `id, rank, price, unit, creator:profiles(id, display_name, profile_image_url), game:games!inner(name, slug), category:categories!inner(name, slug)`;

function mapRows(rows: RawCreatorGameRow[]): CreatorCardData[] {
  return rows
    .filter((row) => row.creator && row.game && row.category)
    .map((row) => ({
      id: row.id,
      creatorId: row.creator!.id,
      displayName: row.creator!.display_name,
      avatarUrl: row.creator!.profile_image_url,
      gameName: row.game!.name,
      rank: row.rank,
      price: row.price,
      unit: row.unit,
      categoryName: row.category!.name,
    }));
}

/**
 * TOPページのおすすめCreator表示で使う取得関数。
 */
export async function getFeaturedCreators(
  limit = 4,
): Promise<CreatorCardData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("creator_games")
    .select(CREATOR_GAME_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<RawCreatorGameRow[]>();

  if (error || !data) {
    console.error("getFeaturedCreators error:", error);
    return [];
  }

  return mapRows(data);
}

export interface CreatorSearchFilters {
  gameSlug?: string;
  categorySlug?: string;
}

/**
 * Creator一覧ページ(/creators)の検索で使う取得関数。
 * gameSlug / categorySlugが指定されていれば、結合先テーブルのslugで絞り込む。
 */
export async function searchCreators(
  filters: CreatorSearchFilters = {},
  limit = 24,
): Promise<CreatorCardData[]> {
  const supabase = createClient();

  let query = supabase
    .from("creator_games")
    .select(CREATOR_GAME_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.gameSlug) {
    query = query.eq("game.slug", filters.gameSlug);
  }
  if (filters.categorySlug) {
    query = query.eq("category.slug", filters.categorySlug);
  }

  const { data, error } = await query.returns<RawCreatorGameRow[]>();

  if (error || !data) {
    console.error("searchCreators error:", error);
    return [];
  }

  return mapRows(data);
}
