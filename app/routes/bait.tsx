import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import {
  babTitle,
  baitCode,
  baitImage,
  baitImageDark,
  baitImageUrl,
  site,
  baitPagePath,
  baitPath,
  baits,
  findBait,
} from "~/lib/content";
import { metaTags, pageMeta } from "~/lib/head";
import { useShare } from "~/lib/share";
import NotFound from "./not-found";

export const meta = ({ params }: { params: Record<string, string | undefined> }) => {
  const b = findBait(params.bab ?? "", params.bait ?? "");
  if (!b) return pageMeta("Bait");
  // "abimisme · 1:1:1"; the description is the bab it belongs to
  return metaTags(`${site.name} · ${baitCode(b)}`, babTitle(b.bab), {
    url: baitImageUrl(b),
    width: 1080,
    height: 1080,
    alt: b.verses.map((v) => v.text).join(" "),
  });
};

export default function BaitPage() {
  const { bab = "", bait: baitNo = "" } = useParams();
  const navigate = useNavigate();
  const { share } = useShare();
  const bait = findBait(bab, baitNo);
  const i = bait ? baits.indexOf(bait) : -1;
  const prev = baits[i - 1];
  const next = baits[i + 1];

  // Arrow keys move between baits
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea") || e.metaKey || e.ctrlKey) return;
      const to = e.key === "ArrowLeft" ? prev : e.key === "ArrowRight" ? next : null;
      if (to) navigate(baitPagePath(to));
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [prev, next, navigate]);

  if (!bait) return <NotFound />;
  const code = baitCode(bait);
  return (
    <article className="bait-page">
      <Link className="back" to={baitPath(bait)}>
        ← Kitab {code}
      </Link>
      {/* both cards are in the page; the CSS shows the one that matches the theme (see "Bait page" in app.css) */}
      <img
        className="bait-img light"
        src={baitImage(bait)}
        width="1080"
        height="1080"
        alt={bait.verses.map((v) => v.text).join(" ")}
        loading="lazy"
      />
      <img className="bait-img dark" src={baitImageDark(bait)} width="1080" height="1080" alt="" loading="lazy" />
      <Button className="block" onClick={() => share(baitPagePath(bait), `Kitab ${code}`)}>
        <Icon name="share" /> Bagikan
      </Button>
      <nav className="pager">
        {prev && (
          <Link className="card" to={baitPagePath(prev)}>
            <Icon name="chevronLeft" /> {baitCode(prev)}
          </Link>
        )}
        {next && (
          <Link className="card next" to={baitPagePath(next)}>
            {baitCode(next)} <Icon name="chevronRight" />
          </Link>
        )}
      </nav>
    </article>
  );
}
