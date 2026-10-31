# abimisme

Kitab nasihat bapak-bapak. A pre-rendered single-page app: Vite, React 19, React Router 7 (framework mode, `ssr: false`) and Storybook.

The content is three Markdown files in this folder (see `claude.md`): `kutipan.md` → `kitab.md` → `kisah.md`.
They are imported as text and parsed in `app/lib/parse.ts`, so editing one is enough; there is no database.

```bash
nvm use            # Node 24 (.nvmrc)
npm install
npm run dev        # http://localhost:5173
npm run storybook  # http://localhost:6006
npm run build      # build/client: one HTML file per page + 404.html, sitemap.xml, robots.txt
npm run typecheck && npm run lint
```

- Local Apache: `npm run build:local` builds the site with `BASE_PATH=/for-fun/abimisme/` and then Storybook (at `/storybook/`); `.htaccess` then serves `build/client/` at
  http://localhost/for-fun/abimisme/ (same as `../chat-learning`). Rebuild after every change. Plain `npm run build` is for GitHub Pages (base `/`).
- Pages live in `app/routes/`, shared pieces in `app/components/` (each with a `.stories.tsx`).
- Pre-rendered addresses (pages, stories, and one /bait/jilid/bab/bait page per bait with its picture card): `scripts/site-paths.ts`. Any other address (a bait inside the kitab list, `/acak`) is served by `404.html`, the SPA shell.
- Old `#/kitab/1/3/3` links redirect to `/kitab/1/3/3` (script in `app/root.tsx`).
- `public/assets/` holds the logo and icons (`python3 build_assets.py`) and the share cards in `public/assets/kitab/`
  (`python3 tools/make_baik_images.py [jilid-bab-bait …]`).
- Deploy: `.github/workflows/static.yml` builds and publishes `build/client` (with Storybook at `/storybook/`) to GitHub Pages.
