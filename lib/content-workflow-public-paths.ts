import type { ContentScope } from "@/types/content-workflow";

export type PublishedPagePath = "/" | "/services" | "/about" | "/contact";

const publishedPagePaths: Partial<Record<ContentScope, PublishedPagePath>> = {
  "pageBlocks.home": "/",
  "pageBlocks.services": "/services",
  "pageBlocks.about": "/about",
  "pageBlocks.contact": "/contact"
};

export function getPublishedPagePath(scope: ContentScope): PublishedPagePath | null {
  return publishedPagePaths[scope] ?? null;
}
