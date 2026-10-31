import { PageHead } from "~/components/PageHead";
import { Quiz } from "~/components/Quiz";
import { pageMeta } from "~/lib/head";

export const meta = () => pageMeta("Tebak Kata Bapak", "Bait puitis ini, aslinya bapak ngomong apa? Tebak kutipan aslinya.");

export default function Tebak() {
  return (
    <>
      <PageHead kicker="Permainan" title="Tebak Kata Bapak">
        Bait puitis di bawah ini, aslinya bapak ngomong apa?
      </PageHead>
      <Quiz />
    </>
  );
}
