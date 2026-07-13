import { siteContentSeed } from "@/data/site-content.seed";
import {
  assertContentScope,
  contentScopes,
  getScopeValue,
  isContentScope,
  mergeScopeValue,
  normalizeScopeValue
} from "@/lib/content-scopes";
import type { ContentScope, ScopeValue } from "@/types/content-workflow";

describe("Content scope registry", () => {
  it("accepts every allowlisted content scope", () => {
    expect(contentScopes).toHaveLength(14);
    expect(contentScopes.every(isContentScope)).toBe(true);
  });

  it.each(["pageBlocks", "pageBlocks.home.hero", "navigation", "__proto__", "brand.name", 1, null])(
    "rejects an unknown scope or arbitrary path: %p",
    (scope) => {
      expect(isContentScope(scope)).toBe(false);
      expect(() => assertContentScope(scope)).toThrow("Unknown content scope");
    }
  );

  it("extracts typed regular section values", () => {
    expect(getScopeValue(siteContentSeed, "brand")).toBe(siteContentSeed.brand);
    expect(getScopeValue(siteContentSeed, "home")).toBe(siteContentSeed.home);
    expect(getScopeValue(siteContentSeed, "design")).toBe(siteContentSeed.design);
  });

  it.each(["home", "services", "about", "contact"] as const)(
    "extracts the pageBlocks.%s value",
    (page) => {
      expect(getScopeValue(siteContentSeed, `pageBlocks.${page}`)).toBe(siteContentSeed.pageBlocks[page]);
    }
  );

  it("merges only the requested regular section", () => {
    const brand = { ...siteContentSeed.brand, name: "Draft Brand" };
    const merged = mergeScopeValue(siteContentSeed, "brand", brand);

    expect(merged.brand).toEqual(brand);
    expect(merged.home).toBe(siteContentSeed.home);
    expect(merged.pageBlocks).toBe(siteContentSeed.pageBlocks);
  });

  it.each(["home", "services", "about", "contact"] as const)(
    "merges only pageBlocks.%s",
    (page) => {
      const scope = `pageBlocks.${page}` as const;
      const nextBlocks = siteContentSeed.pageBlocks[page].map((block, index) => ({
        ...block,
        enabled: index === 0 ? block.enabled : false
      })) as ScopeValue<typeof scope>;
      const merged = mergeScopeValue(siteContentSeed, scope, nextBlocks);

      expect(merged.pageBlocks[page]).toEqual(nextBlocks);
      for (const otherPage of ["home", "services", "about", "contact"] as const) {
        if (otherPage !== page) expect(merged.pageBlocks[otherPage]).toBe(siteContentSeed.pageBlocks[otherPage]);
      }
    }
  );

  it("normalizes design through the existing allowlist", () => {
    const normalized = normalizeScopeValue("design", {
      ...siteContentSeed.design,
      layout: { ...siteContentSeed.design.layout, desktopContainer: 9999 }
    });
    expect(normalized.layout.desktopContainer).toBe(siteContentSeed.design.layout.desktopContainer);
  });

  it.each([
    ["pageBlocks.home", "home"],
    ["pageBlocks.services", "services"],
    ["pageBlocks.about", "about"],
    ["pageBlocks.contact", "contact"]
  ] as const)("normalizes %s without touching another page", (scope, page) => {
    const normalized = normalizeScopeValue(scope, [
      { ...siteContentSeed.pageBlocks[page][0], enabled: false, order: 99, layout: "single-column" }
    ]);

    expect(normalized[0]).toEqual(expect.objectContaining({ id: "hero", enabled: true, order: 0 }));
    expect(normalized).toHaveLength(siteContentSeed.pageBlocks[page].length);
  });

  it("keeps the cases scope limited to SiteContent.cases", () => {
    const scope: ContentScope = "cases";
    expect(getScopeValue(siteContentSeed, scope)).toBe(siteContentSeed.cases);
  });
});
