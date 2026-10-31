import { Link } from "react-router";
import { asliOf, baitCode, baitPagePath, baitPath, usedIn, type Bait } from "~/lib/content";
import { Icon } from "./Icon";

export type BaitCardProps = {
  bait: Bait;
  /** the selected lines of this bait, if any */
  selection?: { from: number; to: number } | null;
  /** open "Kata Bapak aslinya" from the start */
  asliOpen?: boolean;
  onVerse?: (sub: number) => void;
  onShare?: () => void;
};

export function BaitCard({ bait, selection, asliOpen, onVerse, onShare }: BaitCardProps) {
  const asli = asliOf(bait);
  const used = usedIn.get(`${bait.bab}:${bait.no}`) ?? [];
  const code = baitCode(bait);
  return (
    <article className={`bait card${selection ? " active" : ""}`} id={`b-${bait.bab}-${bait.no}`}>
      <header>
        <Link className="num" to={baitPath(bait)} preventScrollReset>
          {code}
        </Link>
        <span className="bait-actions">
          <Link className="icon-btn" to={baitPagePath(bait)} title="Halaman bait" aria-label={`Buka halaman bait ${code}`}>
            <Icon name="image" />
          </Link>
          <button className="icon-btn" aria-label={`Bagikan bait ${code}`} onClick={onShare}>
            <Icon name="share" />
          </button>
        </span>
      </header>
      {bait.verses.map((v) => (
        <span
          key={v.sub}
          className={`verse${selection && v.sub >= selection.from && v.sub <= selection.to ? " sel" : ""}`}
          id={`v-${bait.bab}-${bait.no}-${v.sub}`}
          onClick={() => onVerse?.(v.sub)}
        >
          <sup>{v.sub}</sup>
          {v.text}
        </span>
      ))}
      {asli && (
        <details className="asli" open={asliOpen || undefined}>
          <summary>
            <Icon name="quote" /> Kata Bapak aslinya
          </summary>
          <p>“{asli}”</p>
        </details>
      )}
      {used.length > 0 && (
        <div className="used">
          <Icon name="book" /> Muncul di{" "}
          {used.map((s, i) => (
            <span key={s.slug}>
              {i > 0 && ", "}
              <Link to={`/kisah/${s.slug}`}>{s.title}</Link>
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
