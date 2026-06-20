import { createClient } from "@/lib/supabase/server";

export interface GameOption {
  id: string;
  name: string;
  slug: string;
}

/**
 * is_active = trueのゲームのみ取得する(検索の選択肢・プロフィール編集の選択肢に使用)。
 */
export async function getActiveGames(): Promise<GameOption[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("games")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("getActiveGames error:", error);
    return [];
  }

  return data;
}
