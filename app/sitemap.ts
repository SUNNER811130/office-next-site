import type { MetadataRoute } from "next";

import { getAllInsights } from "@/lib/insights";
import { getAllCases } from "@/lib/cases";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about", "/services", "/corporate-training", "/contact", "/insights", "/cases"];
  const insights = await getAllInsights();
  const cases = await getAllCases();
  const insightRoutes = insights.map((post) => `/insights/${post.slug}`);
  const caseRoutes = cases.map((post) => `/cases/${post.slug}`);

  return [...routes, ...insightRoutes, ...caseRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date()
  }));
}
