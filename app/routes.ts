// The route table. scripts/site-paths.ts lists the addresses to pre-render; keep the two in step.
import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_app.tsx", [
    index("routes/home.tsx"),
    // jilid, or jilid/bab/bait, or jilid/bab/bait/baris (a line, or a range such as 1-3): one page, so selecting a line does not reload it
    route("kitab/*", "routes/kitab.tsx"),
    route("bait/:jilid/:bab/:bait", "routes/bait.tsx"),
    route("kisah", "routes/kisah-list.tsx"),
    route("kisah/:slug", "routes/kisah.tsx"),
    route("kata-bapak/:jilid?", "routes/kata-bapak.tsx"),
    route("tebak", "routes/tebak.tsx"),
    route("acak", "routes/acak.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
