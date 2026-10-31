// Every address that gets its own pre-rendered HTML file (react-router.config.ts) and a line in sitemap.xml (postbuild.ts).
// Keep in step with app/routes.ts.
import { readFileSync } from "node:fs";
import { parseKisah, parseKitab } from "../app/lib/parse.ts";

const root = new URL("../", import.meta.url);
const read = (name: string) => readFileSync(new URL(name, root), "utf8");

export function publicPaths(): string[] {
  const { jilids, babs } = parseKitab(read("kitab.md"));
  const jilidOfBab = (bab: string) => babs.find((b) => b.no === bab)?.jilid ?? "1";
  const stories = parseKisah(read("kisah.md"), jilidOfBab);
  return [
    "/",
    "/kitab",
    ...jilids.map((j) => `/kitab/${j.no}`),
    "/kisah",
    ...stories.map((s) => `/kisah/${s.slug}`),
    "/kata-bapak",
    ...jilids.map((j) => `/kata-bapak/${j.no}`),
    "/tebak",
    ...babs.flatMap((b) => b.baits).map((b) => `/bait/${b.jilid}/${b.bab}/${b.no}`),
  ];
}
