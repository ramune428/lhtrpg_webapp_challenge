import type { MetadataRoute } from "next";

const baseUrl = "https://lhtrpg-tools.com";

const routes = ["/character", "/enemy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/character" ? 1.0 : 0.9,
  }));
}
