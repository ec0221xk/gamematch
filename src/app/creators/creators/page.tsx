import { SearchFilter } from "@/components/creators/SearchFilter";
import { CreatorCard } from "@/components/creators/CreatorCard";
import { searchCreators } from "@/lib/queries/creators";
import { getActiveGames } from "@/lib/queries/games";
import { getCategories } from "@/lib/queries/categories";

interface CreatorsPageProps {
  searchParams: { game?: string; category?: string };
}

export default async function CreatorsPage({
  searchParams,
}: CreatorsPageProps) {
  const [games, categories, creators] = await Promise.all([
    getActiveGames(),
    getCategories(),
    searchCreators({
      gameSlug: searchParams.game,
      categorySlug: searchParams.category,
    }),
  ]);

  const hasFilter = Boolean(searchParams.game || searchParams.category);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">
        Creatorを探す
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        ゲーム名やカテゴリで絞り込めます。
      </p>

      <div className="mt-6">
        <SearchFilter
          games={games}
          categories={categories}
          selectedGame={searchParams.game}
          selectedCategory={searchParams.category}
        />
      </div>

      {creators.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} data={creator} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
          <p className="text-sm text-gray-500">
            {hasFilter
              ? "条件に一致するCreatorが見つかりませんでした。条件を変えて再度お試しください。"
              : "まだCreatorの登録がありません。最初のCreatorになりませんか？"}
          </p>
        </div>
      )}
    </main>
  );
}
