import { site } from "./content";

export type ShareImage = { url: string; width: number; height: number; alt: string };

const defaultImage: ShareImage = {
  url: `${site.url}/assets/og.jpg`,
  width: 1200,
  height: 630,
  alt: "Logo abimisme: buku terbuka dengan huruf A",
};

/**
 * The tags of a page, with the whole title already written. A null description leaves the description tags out.
 * (og:url is set for every page in root.tsx, from the address.)
 */
export function metaTags(title: string, description: string | null, image: ShareImage = defaultImage) {
  return [
    { title },
    ...(description === null ? [] : [{ name: "description", content: description }]),
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: site.name },
    { property: "og:title", content: title },
    ...(description === null ? [] : [{ property: "og:description", content: description }]),
    { property: "og:image", content: image.url },
    { property: "og:image:type", content: /\.png$/i.test(image.url) ? "image/png" : "image/jpeg" },
    { property: "og:image:width", content: String(image.width) },
    { property: "og:image:height", content: String(image.height) },
    { property: "og:image:alt", content: image.alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: image.url },
  ];
}

/**
 * Tab title, description and the link-preview tags (Open Graph, Twitter) of a page: "Kisah · abimisme", or the site title for
 * the home page. A page with its own picture passes it as `image`; the others show the logo card.
 */
export function pageMeta(title?: string, description: string = site.description, image?: ShareImage) {
  return metaTags(title ? `${title} · ${site.name}` : site.title, description, image);
}
