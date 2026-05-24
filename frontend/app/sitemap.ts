import type { MetadataRoute } from "next";

const baseUrl = "https://lhtrpg-tools.com";

const routes: {
  path: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
}[] = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    path: "/character/how-to",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/character/command-details",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/character/updates",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/enemy",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/enemy/how-to",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/enemy/formula",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/enemy/official-data",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/enemy/updates",
    changeFrequency: "monthly",
    priority: 0.6,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
