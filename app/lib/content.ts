// The three Markdown files in the project root, parsed once at load. The pages read from here.
import kitabMd from "../../kitab.md?raw";
import kisahMd from "../../kisah.md?raw";
import kutipanMd from "../../kutipan.md?raw";
import { parseKisah, parseKitab, parseKutipan, type Bab, type Bait, type Ref, type Story } from "./parse";

export const site = {
  name: "abimisme",
  title: "abimisme — Kitab Nasihat Bapak-Bapak",
  description: "Kitab nasihat bapak-bapak Indonesia: kutipan asli, bait puitis, dan kisah-kisahnya.",
  url: "https://abimisme.situs.id",
  themeColor: "#b5532c",
};

const parsed = parseKitab(kitabMd);
export const jilids = parsed.jilids;
export const babs = parsed.babs;
export const baits: Bait[] = babs.flatMap((b) => b.baits);
export const kutipan = parseKutipan(kutipanMd);

export const findBab = (bab: string | number) => babs.find((b) => b.no === String(bab));
export const jilidOfBab = (bab: string | number) => findBab(bab)?.jilid ?? "1";
export const findBait = (bab: string | number, bait: string | number) =>
  baits.find((b) => b.bab === String(bab) && b.no === String(bait));
export const babTitle = (no: string | number) => findBab(no)?.title ?? "";
export const findJilid = (no: string) => jilids.find((j) => j.no === no);

export const stories: Story[] = parseKisah(kisahMd, jilidOfBab);
export const findStory = (slug: string) => stories.find((s) => s.slug === slug);

/** The saying behind a bait, in the bapak's own words. */
export const asliOf = (b: { bab: string | number; no?: string | number; bait?: string | number }) =>
  kutipan.get(`${b.bab}:${b.no ?? b.bait}`);

/** The stories that quote a bait, keyed "bab:bait". */
export const usedIn = new Map<string, Story[]>();
for (const s of stories) {
  for (const r of s.refs) {
    const k = `${r.bab}:${r.bait}`;
    const list = usedIn.get(k) ?? [];
    if (!list.includes(s)) list.push(s);
    usedIn.set(k, list);
  }
}

export const baitCode = (b: Bait) => `${b.jilid}:${b.bab}:${b.no}`;
export const baitPath = (b: Bait) => `/kitab/${b.jilid}/${b.bab}/${b.no}`;
/** The page of one bait: its picture card and the previous/next bait. */
export const baitPagePath = (b: Bait) => `/bait/${b.jilid}/${b.bab}/${b.no}`;
/** The share card made by tools/make_baik_images.py, e.g. assets/kitab/3-20-3.jpg */
export const baitImage = (b: Bait) => `${import.meta.env.BASE_URL}assets/kitab/${b.jilid}-${b.bab}-${b.no}.jpg`;
/** The dark version of the card (the bait page shows it in dark mode; link previews always use the light one). */
export const baitImageDark = (b: Bait) => baitImage(b).replace(/\.jpg$/, "-dark.jpg");
/** Same card with the real domain in front, for link previews (og:image must be an absolute address). */
export const baitImageUrl = (b: Bait) => `${site.url}/assets/kitab/${b.jilid}-${b.bab}-${b.no}.jpg`;
export const refText = (r: Ref) =>
  `${r.jilid || jilidOfBab(r.bab)}:${r.bab}:${r.bait}:${r.from}${r.to !== r.from ? "–" + r.to : ""}`;
export const refPath = (r: Ref) =>
  `/kitab/${r.jilid || jilidOfBab(r.bab)}/${r.bab}/${r.bait}/${r.from}${r.to !== r.from ? "-" + r.to : ""}`;
export const versesOf = (r: Ref) => findBait(r.bab, r.bait)?.verses.filter((v) => v.sub >= r.from && v.sub <= r.to) ?? [];

/** Baits of the first two bab are the gentle ones shown as "today's advice". */
export const dailyBaits = () => {
  const pool = baits.filter((b) => b.bab === "1" || b.bab === "2");
  return pool.length ? pool : baits;
};

export const readMins = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 200));

export type { Bab, Bait, Ref, Story };
