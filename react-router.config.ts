import type { Config } from "@react-router/dev/config";
import { basePath } from "./scripts/base-path.ts";
import { publicPaths } from "./scripts/site-paths.ts";

// A single-page app with one pre-rendered HTML file per page (see scripts/site-paths.ts). Any other address
// (a single bait, say) is served by the SPA fallback that scripts/postbuild.ts publishes as 404.html.
export default {
  ssr: false,
  basename: basePath(),
  prerender: () => publicPaths().map((p) => (p === "/" ? "/" : p.replace(/\/$/, ""))),
} satisfies Config;
