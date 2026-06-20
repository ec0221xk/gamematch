import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { OfferingForm } from "@/components/dashboard/OfferingForm";
import { DeleteOfferingButton } from "@/components/dashboard/DeleteOfferingButton";
import { Badge, Card } from "@/components/ui";
import { getActiveGames } from "@/lib/queries/games";
import { getCategories } from "@/lib/queries/categories";
import { notFound, redirect } from "next/navigation";

type RawOwnedOfferingRow = {
  id: string;
  rank: string | null;
  price: number;
  description: string | null;
  game: { id: string; name: string } | null;
  category: { id: number; name: string } | null;
};

type ProfileData = {
  display_name: string;
  bio: string | null;
  discord_id: string | null;
  country: string | null;
  languages: string[];
  is_creator: boolean;
};

// redirect()の後をTypeScriptがneverと判断する問題を避けるため
// データ取得とレンダリングを別関数に分離する構造に変更
async function getPageData(userId: string) {
  const supabase = createClient();

  const [profileResult, offeringsResult, games, categories] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, bio, discord_id, country, languages, is_creator")
      .eq("id", userId)
      .single(),
    supabase
      .from("creator_games")
      .select(
        "id, rank, price, description, game:games(id, name), category:categories(id, name)",
      )
      .eq("creator_id", userId)
      .order("created_at", { ascending: false })
      .returns<RawOwnedOfferingRow[]>(),
    getActiveGames(),
    getCategories(),
  ]);

  return {
    profile: profileResult.data as ProfileData | null,
    offerings: offeringsResult.data ?? [],
    games,
    categories,
  };
}

export default async function ProfileDashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard/profile");
  }

  const { profile, offerings, games, categories } = await getPageData(user.id);

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">
        マイページ
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        プロフィールと、提供しているサービスを編集できます。
      </p>

      <section className="mt-8">
        <h2 className="text-base font-medium text-gray-900">プロフィール</h2>
        <Card className="mt-4">
          <ProfileForm
            initialValues={{
              displayName: profile.display_name,
              bio: profile.bio ?? "",
              discordId: profile.discord_id ?? "",
              country: profile.country ?? "",
              languages: profile.languages ?? [],
            }}
          />
        </Card>
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium text-gray-900">
            提供しているサービス
          </h2>
          {profile.is_creator && <Badge variant="brand">Creator</Badge>}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          ゲームを1件追加すると、Creatorとして一覧・検索に表示されるようになります。
        </p>

        {offerings.length > 0 && (
          <div className="mt-4 flex flex-col gap-3">
            {offerings.map((offering) => (
              <Card key={offering.id}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-gray-900">
                    {offering.game?.name} ・ {offering.category?.name}
                  </p>
                  <DeleteOfferingButton offeringId={offering.id} />
                </div>
                <div className="mt-3">
                  <OfferingForm
                    games={games}
                    categories={categories}
                    mode="edit"
                    offeringId={offering.id}
                    initialValues={{
                      gameId: offering.game?.id ?? "",
                      categoryId: offering.category?.id ?? 0,
                      rank: offering.rank ?? "",
                      price: offering.price,
                      description: offering.description ?? "",
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-4">
          <h3 className="text-sm font-medium text-gray-900">
            新しいサービスを追加
          </h3>
          <div className="mt-4">
            <OfferingForm games={games} categories={categories} mode="create" />
          </div>
        </Card>
      </section>
    </main>
  );
}
