import { designSettingsDefaults, getDesignCssVariables, normalizeDesignSettings } from "@/lib/design-settings";

describe("Design settings", () => {
  it("uses defaults for missing design data", () => {
    expect(normalizeDesignSettings(undefined)).toEqual(designSettingsDefaults);
  });

  it("falls back for illegal enum and fixed numeric values", () => {
    const design = normalizeDesignSettings({
      typography: { heroTitleScale: "huge" },
      layout: { desktopContainer: 9999, mobileGutter: 21 }
    });
    expect(design.typography.heroTitleScale).toBe("balanced");
    expect(design.layout.desktopContainer).toBe(1400);
    expect(design.layout.mobileGutter).toBe(20);
  });

  it("keeps valid booleans", () => {
    const design = normalizeDesignSettings({ motion: { playOnce: false }, floatingCta: { enabled: false } });
    expect(design.motion.playOnce).toBe(false);
    expect(design.floatingCta.enabled).toBe(false);
  });

  it("only produces mapped CSS variables", () => {
    const design = normalizeDesignSettings({ typography: { bodySize: "<style>" }, layout: { desktopContainer: "100vw" } });
    expect(getDesignCssVariables(design)).toEqual(expect.objectContaining({
      "--site-body-size": "1rem",
      "--site-container-max": "1400px"
    }));
    expect(JSON.stringify(getDesignCssVariables(design))).not.toContain("<style>");
    expect(JSON.stringify(getDesignCssVariables(design))).not.toContain("100vw");
  });
});
