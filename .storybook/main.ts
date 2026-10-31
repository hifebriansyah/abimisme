import type { StorybookConfig } from "@storybook/react-vite";
import { type InlineConfig, type PluginOption, mergeConfig } from "vite";

// Storybook builds the components with its own Vite config: the ~ alias, but not the React Router plugin
// (that one only works in the app build). It is published with the site at /storybook/ (scripts/postbuild.ts).
function withoutReactRouter(base: InlineConfig): InlineConfig {
  const keep = (p: PluginOption): PluginOption =>
    Array.isArray(p)
      ? p.map(keep)
      : p && typeof p === "object" && "name" in p && String(p.name).startsWith("react-router")
        ? false
        : p;
  return { ...base, plugins: (base.plugins || []).map(keep) };
}

const config: StorybookConfig = {
  stories: ["../app/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  core: { disableTelemetry: true },
  // only the logo: the 580 share-card pictures in public/assets/kitab would be copied into Storybook too
  staticDirs: [{ from: "../public/assets/logo.png", to: "/assets/logo.png" }],
  viteFinal: (base) =>
    mergeConfig(withoutReactRouter(base), {
      base: "./",
      publicDir: false,
      resolve: { alias: { "~": new URL("../app", import.meta.url).pathname } },
      server: { fs: { allow: [".."] } },
    }),
};
export default config;
