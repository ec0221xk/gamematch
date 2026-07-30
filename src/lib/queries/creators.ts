import { createClient } from "@/lib/supabase/server";
import type { QueryResult } from "@/lib/types/query";

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
  featureTags: string[];
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
    feature_tags: string[] | null;
  } | null;
  game: { name: string; slug: string } | null;
  category: { name: string; slug: string } | null;
};

// game/categoryはNOT NULLな外部キーのため、!innerを付けても本来除外される行は無い。
// 検索条件(game.slug / category.slug)で絞り込むためにこの結合方法を使う。
const CREATOR_GAME_SELECT = `id, rank, price, unit, creator:profiles(id, display_name, profile_image_url, feature_tags), game:games!inner(name, slug), category:categories!inner(name, slug)`;

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
      featureTags: row.creator!.feature_tags ?? [],
    }));
}

/**
 * TOPページのおすすめCreator表示で使う取得関数。
 */
export async function getFeaturedCreators(
  limit = 4,
): Promise<QueryResult<CreatorCardData[]>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("creator_games")
    .select(CREATOR_GAME_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<RawCreatorGameRow[]>();

  if (error || !data) {
    console.error("getFeaturedCreators error:", error);
    return { ok: false };
  }

  return { ok: true, data: mapRows(data) };
}

export interface CreatorSearchFilters {
  gameSlug?: string;
  // 複数指定時はOR絞り込み(例: トップページの推し活/コーチング入口ボタン)
  categorySlug?: string | string[];
}

/**
 * Creator一覧ページ(/creators)の検索で使う取得関数。
 * gameSlug / categorySlugが指定されていれば、結合先テーブルのslugで絞り込む。
 */
export async function searchCreators(
  filters: CreatorSearchFilters = {},
  limit = 24,
): Promise<QueryResult<CreatorCardData[]>> {
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
    const slugs = Array.isArray(filters.categorySlug)
      ? filters.categorySlug
      : [filters.categorySlug];
    query =
      slugs.length > 1
        ? query.in("category.slug", slugs)
        : query.eq("category.slug", slugs[0]);
  }

  const { data, error } = await query.returns<RawCreatorGameRow[]>();

  if (error || !data) {
    console.error("searchCreators error:", error);
    return { ok: false };
  }

  return { ok: true, data: mapRows(data) };
}
