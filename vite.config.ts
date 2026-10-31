import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { basePath } from "./scripts/base-path.ts";

export default defineConfig({
  base: basePath(),
  plugins: [reactRouter()],
  resolve: { alias: { "~": new URL("./app", import.meta.url).pathname } },
  // The hashed bundles must not land in /assets/: that folder is the site's own pictures and icons (public/assets).
  build: { emptyOutDir: false, assetsDir: "static" },
  // kitab.md, kisah.md and kutipan.md sit in the project root and are imported with ?raw.
  server: { fs: { allow: ["."] } },
});
