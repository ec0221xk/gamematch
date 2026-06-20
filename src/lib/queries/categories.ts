import { createClient } from "@/lib/supabase/server";

export interface CategoryOption {
  id: number;
  name: string;
  slug: string;
}

/**
 * 固定4カテゴリを登録順(id昇順)で取得する。
 */
export async function getCategories(): Promise<CategoryOption[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("id", { ascending: true });

  if (error || !data) {
    console.error("getCategories error:", error);
    return [];
  }

  return data;
}
