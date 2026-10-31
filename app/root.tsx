import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import type { Route } from "./+types/root";
import { THEME_SCRIPT } from "./components/ThemeToggle";
import { site } from "./lib/content";
import "./styles/app.css";

const BASE = import.meta.env.BASE_URL;
const ASSETS = `${BASE}assets/`;

// Links written before the move from #/… addresses to real paths keep working: #/kitab/1/3/3/1-3 → /kitab/1/3/3/1-3
const LEGACY_HASH_SCRIPT = `var h=location.hash;if(h.indexOf("#/")===0)location.replace("${BASE}"+h.slice(2))`;

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: `${ASSETS}favicon.ico`, sizes: "any" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: `${ASSETS}favicon-32.png` },
  { rel: "apple-touch-icon", href: `${ASSETS}apple-touch-icon.png` },
  { rel: "manifest", href: `${ASSETS}site.webmanifest` },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=Inter:wght@400;600;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={site.themeColor} />
        <meta name="apple-mobile-web-app-title" content={site.name} />
        {/* the address of this page on the real domain (the router strips the folder it is served from) */}
        <meta property="og:url" content={`${site.url}${pathname}`} />
        <script dangerouslySetInnerHTML={{ __html: `${LEGACY_HASH_SCRIPT};${THEME_SCRIPT}` }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <div className="loading">Memuat nasihat…</div>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Error";
  return (
    <main>
      <div className="error">
        <h1>{site.name}</h1>
        <p>{message}</p>
      </div>
    </main>
  );
}
