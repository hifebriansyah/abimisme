import { Fragment, useState, type ReactNode } from "react";
import { asliOf, babTitle, jilidOfBab, refPath, refText, versesOf, type Ref } from "~/lib/content";
import { REF_RE } from "~/lib/parse";
import { useShare } from "~/lib/share";
import { ButtonLink } from "./Button";
import { Button } from "./Button";
import { Icon } from "./Icon";

const REF_ONLY = new RegExp(`^${REF_RE.source}$`);

function toRef(m: RegExpMatchArray): Ref {
  return { jilid: m[1] || jilidOfBab(m[2]), bab: m[2], bait: m[3], from: Number(m[4]), to: Number(m[5] ?? m[4]) };
}

/** Text inside *…* is the bapak speaking; "(…)" in it is context that is not part of the kitab, shown muted. */
function Spoken({ text }: { text: string }) {
  return (
    <em>
      {text.split(/(\([^()]+\))/).map((part, i) =>
        part.startsWith("(") && part.endsWith(")") ? (
          <span className="ctx" key={i}>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </em>
  );
}

export type RefPanelProps = { r: Ref };

export function RefPanel({ r }: RefPanelProps) {
  const { share } = useShare();
  const asli = asliOf({ bab: r.bab, bait: r.bait });
  return (
    <div className="ref-panel card">
      <div className="kicker">
        Kitab {refText(r)} · {babTitle(r.bab)}
      </div>
      <div className="verses-q">
        {versesOf(r).map((v, i) => (
          <Fragment key={v.sub}>
            {i > 0 && <br />}
            {v.text}
          </Fragment>
        ))}
      </div>
      {asli && (
        <p className="asli-q">
          <span>Kata Bapak:</span> “{asli}”
        </p>
      )}
      <div className="row">
        <ButtonLink primary to={refPath(r)}>
          Buka di kitab →
        </ButtonLink>
        <Button onClick={() => share(refPath(r), `Kitab Abi ${refText(r)}`)}>
          <Icon name="share" /> Bagikan
        </Button>
      </div>
    </div>
  );
}

function Paragraph({ text }: { text: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const refs: Ref[] = [];
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(/`([^`]+)`|\*([^*]+)\*/g)) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    last = m.index + m[0].length;
    if (m[2] !== undefined) {
      nodes.push(<Spoken key={m.index} text={m[2]} />);
      continue;
    }
    const ref = m[1].match(REF_ONLY);
    if (!ref) {
      nodes.push(<code key={m.index}>{m[1]}</code>);
      continue;
    }
    const r = toRef(ref);
    const i = refs.push(r) - 1;
    nodes.push(
      <button className="ref-chip" key={m.index} aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
        {refText(r)}
      </button>,
    );
  }
  if (last < text.length) nodes.push(text.slice(last));
  return (
    <>
      <p>{nodes}</p>
      {open !== null && <RefPanel r={refs[open]} />}
    </>
  );
}

/** A kisah: paragraphs separated by blank lines, *spoken* text and `(1:3:3:1–3)` references that open the verse in place. */
export function StoryBody({ body }: { body: string }) {
  return (
    <div className="content">
      {body
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p && !/^-{3,}$/.test(p))
        .map((p, i) => (
          <Paragraph key={i} text={p.replace(/\n/g, " ")} />
        ))}
    </div>
  );
}
