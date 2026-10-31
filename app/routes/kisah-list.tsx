import { PageHead } from "~/components/PageHead";
import { StoryCard } from "~/components/StoryCard";
import { stories } from "~/lib/content";
import { pageMeta } from "~/lib/head";

export const meta = () =>
  pageMeta("Kisah", "Cerita sehari-hari Pak Abi bersama keluarganya. Setiap nasihat merujuk ke bait dan barisnya di kitab.");

export default function KisahList() {
  return (
    <>
      <PageHead kicker="Kisah-kisah Bapak" title="Kisah">
        Cerita sehari-hari Pak Abi. Setiap nasihat merujuk ke bait dan barisnya di kitab.
      </PageHead>
      {stories.map((s, i) => (
        <StoryCard key={s.slug} story={s} index={i} />
      ))}
    </>
  );
}
