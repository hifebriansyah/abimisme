import { useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { FlipCard } from "~/components/FlipCard";
import { Icon } from "~/components/Icon";
import { PageHead } from "~/components/PageHead";
import { findJilid, jilids, kutipan } from "~/lib/content";
import { pageMeta } from "~/lib/head";
import NotFound from "./not-found";

export const meta = ({ params }: { params: Record<string, string | undefined> }) =>
  pageMeta(`Kata Bapak · Jilid ${params.jilid ?? "1"}`, "Kutipan asli bapak-bapak. Balik kartunya untuk melihat versi kitabnya.");

export default function KataBapak() {
  const { jilid: jilidNo = "1" } = useParams();
  const jilid = findJilid(jilidNo);
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  if (!jilid) return <NotFound />;

  const baits = jilid.babs.flatMap((b) => b.baits).filter((b) => kutipan.has(`${b.bab}:${b.no}`));
  const id = (b: (typeof baits)[number]) => `${b.bab}:${b.no}`;
  const toggle = (key: string, on?: boolean) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      if (on ?? !next.has(key)) next.add(key);
      else next.delete(key);
      return next;
    });
  const flipAll = () => {
    const anyOff = baits.some((b) => !flipped.has(id(b)));
    timers.current.forEach(clearTimeout);
    timers.current = baits.map((b, i) => setTimeout(() => toggle(id(b), anyOff), i * 40));
  };

  return (
    <>
      <PageHead kicker="Kutipan Asli" title="Kata Bapak">
        Begini bapak-bapak ngomongnya. Ketuk kartu untuk membaliknya ke versi kitab.
      </PageHead>
      <div className="pills">
        {jilids.map((j) => (
          <Link className="pill" to={`/kata-bapak/${j.no}`} key={j.no} aria-current={j.no === jilid.no}>
            Jilid {j.no}: {j.title}
          </Link>
        ))}
        <button className="pill" onClick={flipAll}>
          <Icon name="flip" /> Balik semua
        </button>
      </div>
      <div className="flip-grid">
        {baits.map((b) => (
          <FlipCard key={id(b)} bait={b} flipped={flipped.has(id(b))} onToggle={() => toggle(id(b))} />
        ))}
      </div>
    </>
  );
}
