import { Link } from "react-router";
import { asliOf, baitCode, baitPath, type Bait } from "~/lib/content";
import { Icon } from "./Icon";

export type FlipCardProps = { bait: Bait; flipped: boolean; onToggle: () => void };

export function FlipCard({ bait, flipped, onToggle }: FlipCardProps) {
  const code = baitCode(bait);
  return (
    <div
      className={`flip${flipped ? " on" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`Balik kartu ${code}`}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("a")) onToggle();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="flip-in">
        <div className="face front card">
          <div className="lbl">
            <span>{code}</span>
            <Icon name="quote" />
          </div>
          <q>{asliOf(bait)}</q>
          <div className="hint">ketuk untuk membalik</div>
        </div>
        <div className="face back card">
          <div className="lbl">
            <span>Kitab {code}</span>
            <Icon name="scroll" />
          </div>
          <div className="p">
            {bait.verses.map((v, i) => (
              <span key={v.sub}>
                {i > 0 && <br />}
                {v.text}
              </span>
            ))}
          </div>
          <Link to={baitPath(bait)}>Buka di kitab →</Link>
        </div>
      </div>
    </div>
  );
}
