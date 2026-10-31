import { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { BaitCard } from "~/components/BaitCard";
import { PageHead } from "~/components/PageHead";
import { SelectionBar } from "~/components/SelectionBar";
import { baitCode, baitPagePath, findBait, findJilid, jilids, refPath, refText, versesOf, type Ref } from "~/lib/content";
import { pageMeta } from "~/lib/head";
import { useShare } from "~/lib/share";
import NotFound from "./not-found";

// kitab/*  →  [jilid] or [jilid, bab, bait] or [jilid, bab, bait, baris] where baris is "2" or a range "1-3"
function resolve(splat: string | undefined) {
  const [jilid = "1", bab, bait, range] = (splat ?? "").split("/").filter(Boolean).map(decodeURIComponent);
  return { jilid, bab, bait, range };
}

export const meta = ({ params }: { params: Record<string, string | undefined> }) => {
  const { jilid, bab, bait } = resolve(params["*"]);
  if (bab && bait) return pageMeta(`Kitab ${jilid}:${bab}:${bait}`);
  const j = findJilid(jilid);
  return pageMeta(j ? `Jilid ${j.no}: ${j.title}` : "Kitab");
};

export default function Kitab() {
  const { "*": splat } = useParams();
  const navigate = useNavigate();
  const { copy, share, linkTo } = useShare();
  const { jilid: jilidNo, bab: babNo, bait: baitNo, range } = resolve(splat);
  const jilid = findJilid(jilidNo);
  const bait = babNo && baitNo ? findBait(babNo, baitNo) : undefined;
  const skipScroll = useRef(false);

  // The selected lines come from the address, so reloading or sharing the address keeps them.
  let sel: Ref | null = null;
  if (bait) {
    const [from, to] = (range ?? "").split("-").map(Number);
    const subs = bait.verses.map((v) => v.sub);
    const lo = from || subs[0];
    const hi = to || from || subs[subs.length - 1];
    sel = { jilid: bait.jilid, bab: bait.bab, bait: bait.no, from: Math.min(lo, hi), to: Math.max(lo, hi) };
  }

  const select = (next: Ref | null) => {
    skipScroll.current = true;
    navigate(next ? refPath(next) : `/kitab/${jilidNo}`, { replace: true, preventScrollReset: true });
  };

  const onVerse = (b: NonNullable<typeof bait>, sub: number) => {
    const at = (from: number, to: number): Ref => ({ jilid: b.jilid, bab: b.bab, bait: b.no, from, to });
    if (!sel || sel.bab !== b.bab || sel.bait !== b.no) return select(at(sub, sub));
    if (sel.from === sel.to && sel.from === sub) return select(null);
    if (sub >= sel.from && sub <= sel.to) return select(at(sub, sub));
    select(at(Math.min(sel.from, sub), Math.max(sel.to, sub)));
  };

  useEffect(() => {
    if (skipScroll.current) {
      skipScroll.current = false;
      return;
    }
    if (bait) document.getElementById(`b-${bait.bab}-${bait.no}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [bait]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sel) select(null);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  if (!jilid || (babNo && !bait)) return <NotFound />;

  return (
    <>
      <PageHead kicker="Kitab Nasihat" title="Kitab">
        Ketuk baris untuk memilih (ketuk baris lain di bait yang sama untuk memperluas), lalu salin atau bagikan.
      </PageHead>
      <div className="pills">
        {jilids.map((j) => (
          <Link className="pill" to={`/kitab/${j.no}`} key={j.no} aria-current={j.no === jilid.no}>
            Jilid {j.no}: {j.title}
          </Link>
        ))}
      </div>
      {jilid.babs.map((bab) => (
        <section className="bab" id={`bab-${bab.no}`} key={bab.no}>
          <div className="kicker">
            Jilid {bab.jilid} · Bab {bab.no}
          </div>
          <h3>{bab.title}</h3>
          {bab.baits.map((b) => (
            <BaitCard
              key={b.no}
              bait={b}
              selection={sel && sel.bab === b.bab && sel.bait === b.no ? sel : null}
              asliOpen={bait === b}
              onVerse={(sub) => onVerse(b, sub)}
              onShare={() => share(baitPagePath(b), `Kitab ${baitCode(b)}`)}
            />
          ))}
        </section>
      ))}
      <SelectionBar
        label={sel ? refText(sel) : null}
        onClose={() => select(null)}
        onCopy={() => {
          if (!sel) return;
          const text = versesOf(sel)
            .map((v) => v.text)
            .join(" ");
          copy(`${text}\n— Kitab Abi ${refText(sel)}\n${linkTo(refPath(sel))}`, `Disalin ${refText(sel)}`);
        }}
        onShare={() => sel && share(refPath(sel), `Kitab Abi ${refText(sel)}`)}
      />
    </>
  );
}
