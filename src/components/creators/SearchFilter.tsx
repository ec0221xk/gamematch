import { Button, Select } from "@/components/ui";
import type { GameOption } from "@/lib/queries/games";
import type { CategoryOption } from "@/lib/queries/categories";

interface SearchFilterProps {
  games: GameOption[];
  categories: CategoryOption[];
  selectedGame?: string;
  selectedCategory?: string;
}

/**
 * ゲーム名・カテゴリで絞り込む検索フォーム。
 * JavaScriptに依存しない素のGETフォームのため、「検索する」を押すとURLの
 * クエリパラメータ(?game=...&category=...)が更新されてページが再読み込みされる。
 */
export function SearchFilter({
  games,
  categories,
  selectedGame,
  selectedCategory,
}: SearchFilterProps) {
  const gameOptions = games.map((game) => ({
    label: game.name,
    value: game.slug,
  }));
  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.slug,
  }));

  return (
    <form
      action="/creators"
      method="get"
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
    >
      <Select
        name="game"
        label="ゲーム"
        placeholder="すべてのゲーム"
        options={gameOptions}
        defaultValue={selectedGame ?? ""}
      />
      <Select
        name="category"
        label="カテゴリ"
        placeholder="すべてのカテゴリ"
        options={categoryOptions}
        defaultValue={selectedCategory ?? ""}
      />
      <Button type="submit">検索する</Button>
    </form>
  );
}
