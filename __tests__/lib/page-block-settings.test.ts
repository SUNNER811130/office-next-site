import {
  aboutBlockDefinitions,
  getOrderedEnabledAboutBlocks,
  getOrderedEnabledHomeBlocks,
  getOrderedEnabledServicesBlocks,
  getPageBlockAttributes,
  homeBlockDefinitions,
  normalizePageBlockSettings,
  normalizeAboutBlocks,
  normalizeServicesBlocks,
  pageBlockSettingsDefaults,
  servicesBlockDefinitions
} from "@/lib/page-block-settings";

describe("Page block settings", () => {
  it("uses defaults when pageBlocks or home is missing", () => {
    expect(normalizePageBlockSettings(undefined)).toEqual(pageBlockSettingsDefaults);
    expect(normalizePageBlockSettings({})).toEqual(pageBlockSettingsDefaults);
  });

  it("drops unknown and duplicate IDs, then restores missing known blocks", () => {
    const settings = normalizePageBlockSettings({ home: [
      { id: "faq", enabled: true, order: 1 },
      { id: "faq", enabled: false, order: 2 },
      { id: "header", enabled: true, order: 0 }
    ] });
    expect(settings.home).toHaveLength(homeBlockDefinitions.length);
    expect(settings.home.filter((block) => block.id === "faq")).toHaveLength(1);
    expect(settings.home.some((block) => (block.id as string) === "header")).toBe(false);
  });

  it("normalizes orders and keeps hero enabled and first", () => {
    const settings = normalizePageBlockSettings({ home: [
      { id: "faq", enabled: true, order: 0, background: "default", motion: "inherit", layout: "default" },
      { id: "hero", enabled: false, order: 99, background: "default", motion: "inherit", layout: "wide" },
      { id: "services", enabled: true, order: "bad" }
    ] });
    expect(settings.home[0]).toEqual(expect.objectContaining({ id: "hero", enabled: true, order: 0 }));
    expect(settings.home.map((block) => block.order)).toEqual(settings.home.map((_, index) => index));
  });

  it("falls back for invalid booleans and allowlisted presentation values", () => {
    const settings = normalizePageBlockSettings({ home: [{
      id: "faq", enabled: "false", order: 1, background: "bg-red-500", motion: "javascript:alert(1)", layout: "w-screen"
    }] });
    const faq = settings.home.find((block) => block.id === "faq")!;
    expect(faq).toEqual(expect.objectContaining({ enabled: true, background: "default", motion: "inherit", layout: "default" }));
    expect(JSON.stringify(getPageBlockAttributes(faq))).not.toMatch(/bg-red|javascript|w-screen/);
  });

  it("filters disabled blocks and returns the normalized order", () => {
    const settings = normalizePageBlockSettings({ home: pageBlockSettingsDefaults.home.map((block) =>
      block.id === "pain-points" ? { ...block, enabled: false } : block.id === "faq" ? { ...block, order: 1 } : block
    ) });
    const rendered = getOrderedEnabledHomeBlocks(settings);
    expect(rendered.some((block) => block.id === "pain-points")).toBe(false);
    expect(rendered[0].id).toBe("hero");
    expect(rendered[1].id).toBe("work-upgrade");
  });

  it("only accepts layouts supported by each block", () => {
    const settings = normalizePageBlockSettings({ home: [{ id: "services", layout: "single-column" }] });
    expect(settings.home.find((block) => block.id === "services")?.layout).toBe("default");
  });

  it("uses services defaults when an older pageBlocks value has no services", () => {
    const settings = normalizePageBlockSettings({ home: pageBlockSettingsDefaults.home });
    expect(settings.services).toEqual(pageBlockSettingsDefaults.services);
  });

  it("normalizes unknown, duplicate, missing and invalid services blocks", () => {
    const services = normalizeServicesBlocks([
      { id: "faq", enabled: "false", order: 0, background: "bg-red-500", motion: "javascript", layout: "w-screen" },
      { id: "faq", enabled: false, order: 1 },
      { id: "footer", enabled: true, order: 2 }
    ]);
    expect(services).toHaveLength(servicesBlockDefinitions.length);
    expect(services.filter((block) => block.id === "faq")).toHaveLength(1);
    expect(services.some((block) => (block.id as string) === "footer")).toBe(false);
    expect(services.find((block) => block.id === "faq")).toEqual(expect.objectContaining({ enabled: true, background: "default", motion: "inherit", layout: "default" }));
  });

  it("keeps the services hero enabled and first and creates continuous order", () => {
    const services = normalizeServicesBlocks([
      { id: "faq", enabled: true, order: 0 },
      { id: "hero", enabled: false, order: 99 },
      { id: "service-cards", enabled: true, order: "invalid" }
    ]);
    expect(services[0]).toEqual(expect.objectContaining({ id: "hero", enabled: true, order: 0 }));
    expect(services.map((block) => block.order)).toEqual([0, 1, 2, 3]);
  });

  it("filters disabled services blocks in normalized order", () => {
    const settings = normalizePageBlockSettings({
      home: pageBlockSettingsDefaults.home,
      services: pageBlockSettingsDefaults.services.map((block) => block.id === "case-snapshots" ? { ...block, enabled: false } : block)
    });
    const rendered = getOrderedEnabledServicesBlocks(settings);
    expect(rendered.map((block) => block.id)).toEqual(["hero", "service-cards", "faq"]);
  });

  it("rejects unsupported services layouts", () => {
    const services = normalizeServicesBlocks([{ id: "service-cards", layout: "two-column" }]);
    expect(services.find((block) => block.id === "service-cards")?.layout).toBe("default");
  });

  it("uses about defaults when an older pageBlocks value has no about", () => {
    const settings = normalizePageBlockSettings({ home: pageBlockSettingsDefaults.home, services: pageBlockSettingsDefaults.services });
    expect(settings.about).toEqual(pageBlockSettingsDefaults.about);
  });

  it("normalizes unknown, duplicate, missing and invalid about blocks", () => {
    const about = normalizeAboutBlocks([
      { id: "faq", enabled: "false", order: 0, background: "bg-red-500", motion: "javascript", layout: "w-screen" },
      { id: "faq", enabled: false, order: 1 },
      { id: "admin", enabled: true, order: 2 }
    ]);
    expect(about).toHaveLength(aboutBlockDefinitions.length);
    expect(about.filter((block) => block.id === "faq")).toHaveLength(1);
    expect(about.some((block) => (block.id as string) === "admin")).toBe(false);
    expect(about.find((block) => block.id === "faq")).toEqual(expect.objectContaining({ enabled: true, background: "default", motion: "inherit", layout: "default" }));
  });

  it("keeps the about hero enabled and first and creates continuous order", () => {
    const about = normalizeAboutBlocks([{ id: "faq", enabled: true, order: 0 }, { id: "hero", enabled: false, order: 99 }, { id: "testimonials", enabled: true, order: "bad" }]);
    expect(about[0]).toEqual(expect.objectContaining({ id: "hero", enabled: true, order: 0 }));
    expect(about.map((block) => block.order)).toEqual([0, 1, 2, 3, 4]);
  });

  it("filters disabled about blocks in normalized order", () => {
    const settings = normalizePageBlockSettings({ ...pageBlockSettingsDefaults, about: pageBlockSettingsDefaults.about.map((block) => block.id === "founder-experience" ? { ...block, enabled: false } : block) });
    expect(getOrderedEnabledAboutBlocks(settings).map((block) => block.id)).toEqual(["hero", "brand-positioning", "testimonials", "faq"]);
  });

  it("rejects unsupported about layouts and arbitrary classes", () => {
    const about = normalizeAboutBlocks([{ id: "brand-positioning", layout: "single-column", background: "bg-black", motion: "animate-spin" }]);
    const block = about.find((item) => item.id === "brand-positioning")!;
    expect(block).toEqual(expect.objectContaining({ layout: "default", background: "default", motion: "inherit" }));
    expect(JSON.stringify(getPageBlockAttributes(block))).not.toMatch(/bg-black|animate-spin/);
  });
});
