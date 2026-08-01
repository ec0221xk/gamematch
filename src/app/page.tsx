import { Hero } from "@/components/marketing/Hero";
import { GameCards } from "@/components/marketing/GameCards";
import { FeaturedCreators } from "@/components/marketing/FeaturedCreators";
import { SearchNav } from "@/components/marketing/SearchNav";
import { TrustSection } from "@/components/marketing/TrustSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { CreatorCTA } from "@/components/marketing/CreatorCTA";
import { getFeaturedCreators } from "@/lib/queries/creators";

/**
 * 最終セクション順:
 * Hero(CTA・下部にカテゴリ帯を内包)
 * → GameCards(ゲーム別カードグリッド → /creatorsへ遷移)
 * → FeaturedCreators(注目Creator)
 * → SearchNav(3導線カード)
 * → TrustSection(安心宣言・Discord言い換え済)
 * → HowItWorks(3ステップ・Discord言い換え済)
 * → CreatorCTA(Creator募集・フッター直前)
 *
 * 削除: PopularGames(GameCardsで代替) / CategoryGrid(SearchNavで代替)
 * / TwoPillars(役割をHero下部のカテゴリ帯に統合したため廃止)
 */
export default async function Home() {
  const creatorsResult = await getFeaturedCreators(3);

  return (
    <main>
      <Hero />
      <GameCards />
      {creatorsResult.ok && <FeaturedCreators creators={creatorsResult.data} />}
      <SearchNav />
      <TrustSection />
      <HowItWorks />
      <CreatorCTA />
    </main>
  );
}
