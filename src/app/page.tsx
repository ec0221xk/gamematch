import { Hero } from "@/components/marketing/Hero";
import { TwoPillars } from "@/components/marketing/TwoPillars";
import { GameCards } from "@/components/marketing/GameCards";
import { FeaturedCreators } from "@/components/marketing/FeaturedCreators";
import { SearchNav } from "@/components/marketing/SearchNav";
import { TrustSection } from "@/components/marketing/TrustSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { CreatorCTA } from "@/components/marketing/CreatorCTA";
import { getFeaturedCreators } from "@/lib/queries/creators";

/**
 * 最終セクション順:
 * Hero(CTA1つ・シンプル)
 * → TwoPillars(推し活/コーチングの2本柱訴求)
 * → GameCards(ゲーム別カードグリッド → /creatorsへ遷移)
 * → FeaturedCreators(注目Creator)
 * → SearchNav(3導線カード)
 * → TrustSection(安心宣言・Discord言い換え済)
 * → HowItWorks(3ステップ・Discord言い換え済)
 * → CreatorCTA(Creator募集・フッター直前)
 *
 * 削除: PopularGames(GameCardsで代替) / CategoryGrid(SearchNavで代替)
 */
export default async function Home() {
  const creatorsResult = await getFeaturedCreators(3);

  return (
    <main>
      <Hero />
      <TwoPillars />
      <GameCards />
      {creatorsResult.ok && <FeaturedCreators creators={creatorsResult.data} />}
      <SearchNav />
      <TrustSection />
      <HowItWorks />
      <CreatorCTA />
    </main>
  );
}
