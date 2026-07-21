import { readFileSync } from "fs";
import path from "path";

import { getPublishedPagePath } from "@/lib/content-workflow-public-paths";
import type { ContentScope } from "@/types/content-workflow";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("Published workflow public paths", () => {
  it.each([
    ["pageBlocks.home", "/"],
    ["pageBlocks.services", "/services"],
    ["pageBlocks.about", "/about"],
    ["pageBlocks.contact", "/contact"]
  ] as const)("maps %s to %s", (scope, path) => {
    expect(getPublishedPagePath(scope)).toBe(path);
  });

  it.each([
    "brand",
    "home",
    "founder",
    "services",
    "cases",
    "testimonials",
    "faq",
    "contact",
    "social",
    "design"
  ] satisfies ContentScope[])("does not map the general scope %s", (scope) => {
    expect(getPublishedPagePath(scope)).toBeNull();
  });

  it("keeps revalidation scoped to successful Publish", () => {
    const publishRoute = source("app/api/admin/content/[section]/publish/route.ts");
    const nonPublishRoutes = [
      source("app/api/admin/content/[section]/draft/route.ts"),
      source("app/api/admin/content/[section]/editor/route.ts")
    ];

    expect(publishRoute).toContain("publishDraft(input)");
    expect(publishRoute).toContain("revalidatePath(publishedPagePath, \"page\")");
    for (const route of nonPublishRoutes) expect(route).not.toContain("revalidatePath");
  });

  it("does not add public-page dynamic or client cache-busting workarounds", () => {
    const publicPages = ["app/(site)/page.tsx", "app/(site)/services/page.tsx", "app/(site)/about/page.tsx", "app/(site)/contact/page.tsx"]
      .map(source)
      .join("\n");
    const repairSources = [
      source("lib/content-workflow-public-paths.ts"),
      source("app/api/admin/content/[section]/publish/route.ts")
    ].join("\n");

    expect(publicPages).not.toContain("force-dynamic");
    expect(repairSources).not.toMatch(/cache[-_]?bust|window\.location\.reload|router\.refresh/);
    expect(repairSources).not.toMatch(/\bany\b/);
  });
});
