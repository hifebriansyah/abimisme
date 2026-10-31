// Pure parsers for kitab.md, kutipan.md and kisah.md (also used by scripts/site-paths.ts, so no Vite-only imports here).
// Addresses are jilid:bab:bait:baris.

export type Verse = { sub: number; text: string };
export type Bait = { jilid: string; bab: string; no: string; verses: Verse[] };
export type Bab = { jilid: string; jilidTitle: string; no: string; title: string; baits: Bait[] };
export type Jilid = { no: string; title: string; babs: Bab[] };
export type Ref = { jilid: string; bab: string; bait: string; from: number; to: number };
export type Story = { title: string; slug: string; body: string; refs: Ref[]; who?: string; excerpt: string };

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// (1:3:3:1–3), with or without the jilid in front
export const REF_RE = /\((?:(\d+):)?(\d+):(\d+):(\d+)(?:[–-](\d+))?\)/;

export function parseKitab(md: string) {
  const jilids: Jilid[] = [];
  const babs: Bab[] = [];
  let jilid: Jilid | null = null;
  let bab: Bab | null = null;
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^##\s+Jilid\s+(\d+):\s*(.+)$/))) {
      jilid = { no: m[1], title: m[2], babs: [] };
      jilids.push(jilid);
    } else if ((m = line.match(/^#{2,3}\s+Bab\s+(\d+):\s*(.+)$/))) {
      if (!jilid) {
        jilid = { no: "1", title: "Jilid 1", babs: [] };
        jilids.push(jilid);
      }
      bab = { jilid: jilid.no, jilidTitle: jilid.title, no: m[1], title: m[2], baits: [] };
      jilid.babs.push(bab);
      babs.push(bab);
    } else if (bab && (m = line.match(/^(?:(\d+):)?(\d+):(\d+):(\d+)\s+(.+)$/))) {
      const [, j, babNo, baitNo, barisNo, text] = m;
      let bait = bab.baits.find((b) => b.no === baitNo);
      if (!bait) bab.baits.push((bait = { jilid: j || bab.jilid, bab: babNo, no: baitNo, verses: [] }));
      bait.verses.push({ sub: Number(barisNo), text });
    }
  }
  return { jilids, babs };
}

/** The original sayings, keyed "bab:bait" (and "jilid:bab:bait" when the file gives the jilid). */
export function parseKutipan(md: string) {
  const map = new Map<string, string>();
  for (const raw of md.split("\n")) {
    const m = raw.trim().match(/^(?:(\d+):)?(\d+):(\d+)\s+(.+)$/);
    if (m) {
      map.set(`${m[2]}:${m[3]}`, m[4]);
      if (m[1]) map.set(`${m[1]}:${m[2]}:${m[3]}`, m[4]);
    }
  }
  return map;
}

export function parseKisah(md: string, jilidOfBab: (bab: string) => string): Story[] {
  return md
    .split(/^## Kisah: /m)
    .slice(1)
    .map((chunk) => {
      const [title, ...rest] = chunk.split("\n");
      const body = rest
        .join("\n")
        .trim()
        .replace(/\n-{3,}\s*$/, "")
        .trim();
      const refs = [...body.matchAll(new RegExp("`" + REF_RE.source + "`", "g"))].map(([, jilid, bab, bait, from, to]) => ({
        jilid: jilid || jilidOfBab(bab),
        bab,
        bait,
        from: Number(from),
        to: Number(to ?? from),
      }));
      const who = body.match(/\*\((\p{Lu}\p{Ll}+),\)/u)?.[1];
      const first = body.split(/\n\s*\n/)[0].replace(/[*_`]/g, "");
      return {
        title: title.trim(),
        slug: slugify(title),
        body,
        refs,
        who,
        excerpt: first.length > 170 ? first.slice(0, 167).trimEnd() + "…" : first,
      };
    });
}
