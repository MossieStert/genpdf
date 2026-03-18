import { useEffect } from "react";

interface PageMeta {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const usePageMeta = ({
  title,
  description,
  keywords,
  image = "/og-genpdf.png",
  url = window.location.href,
}: PageMeta) => {
  useEffect(() => {
    /* ---------- Title ---------- */
    document.title = title;

    /* ---------- Helper ---------- */
    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      let tag = document.querySelector(
        `meta[${attr}="${key}"]`
      ) as HTMLMetaElement | null;

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }

      tag.content = content;
    };

    /* ---------- Standard SEO ---------- */
    if (description) setMeta("name", "description", description);
    if (keywords) setMeta("name", "keywords", keywords);

    /* ---------- OpenGraph ---------- */
    setMeta("property", "og:type", "website");
    setMeta("property", "og:title", title);
    if (description) setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);
    setMeta("property", "og:url", url);

    /* ---------- Twitter ---------- */
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    if (description) setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

  }, [title, description, keywords, image, url]);
};
