import type { MetadataRoute } from "next";

import { getAllInsights } from "@/lib/insights";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about", "/services", "/corporate-training", "/contact", "/insights"];
  const posts = await getAllInsights();
  const insightRoutes = posts.map((post) => `/insights/${post.slug}`);

  return [...routes, ...insightRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date()
  }));
}
