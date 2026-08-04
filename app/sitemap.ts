import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-08-04T00:00:00+08:00");
  return [
    { url: "https://squareson.github.io/", lastModified: updated, changeFrequency: "monthly", priority: 1 },
    { url: "https://squareson.github.io/en/", lastModified: updated, changeFrequency: "monthly", priority: 0.9 },
  ];
}
