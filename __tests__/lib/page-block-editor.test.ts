import { aboutBlockEditorConfig } from "@/components/admin/about-block-editor";
import { contactBlockEditorConfig } from "@/components/admin/contact-block-editor";
import { createPageBlockSavePayload, movePageBlock, requestPageBlockSave, updatePageBlock } from "@/components/admin/page-block-editor/page-block-editor-helpers";
import { pageBlockBackgroundOptions, pageBlockMotionOptions, pageBlockPreviewDevices } from "@/components/admin/page-block-editor/page-block-editor-options";
import { homeBlockEditorConfig } from "@/components/admin/home-block-editor";
import { servicesBlockEditorConfig } from "@/components/admin/services-block-editor";
import { pageBlockSettingsDefaults } from "@/lib/page-block-settings";

describe("Shared page block editor", () => {
  it("keeps page-specific wrappers declarative and correctly scoped", () => {
    expect([homeBlockEditorConfig.page, servicesBlockEditorConfig.page, aboutBlockEditorConfig.page, contactBlockEditorConfig.page]).toEqual(["home", "services", "about", "contact"]);
    expect([homeBlockEditorConfig.previewPath, servicesBlockEditorConfig.previewPath, aboutBlockEditorConfig.previewPath, contactBlockEditorConfig.previewPath]).toEqual(["/", "/services", "/about", "/contact"]);
    expect([homeBlockEditorConfig.defaultBlocks, servicesBlockEditorConfig.defaultBlocks, aboutBlockEditorConfig.defaultBlocks, contactBlockEditorConfig.defaultBlocks]).toEqual([
      pageBlockSettingsDefaults.home, pageBlockSettingsDefaults.services, pageBlockSettingsDefaults.about, pageBlockSettingsDefaults.contact
    ]);
  });

  it("creates a nested save payload containing only the selected page and blocks", () => {
    const payload = createPageBlockSavePayload("contact", pageBlockSettingsDefaults.contact);
    expect(payload).toEqual({ page: "contact", blocks: pageBlockSettingsDefaults.contact });
    expect(payload).not.toHaveProperty("home");
    expect(payload).not.toHaveProperty("services");
    expect(payload).not.toHaveProperty("about");
  });

  it("moves non-hero blocks and continuously updates order", () => {
    const moved = movePageBlock(pageBlockSettingsDefaults.services, 2, -1);
    expect(moved.map((block) => block.id)).toEqual(["hero", "case-snapshots", "service-cards", "faq"]);
    expect(moved.map((block) => block.order)).toEqual([0, 1, 2, 3]);
  });

  it("does not move the locked hero or move another block above it", () => {
    expect(movePageBlock(pageBlockSettingsDefaults.contact, 0, 1)).toEqual(pageBlockSettingsDefaults.contact);
    expect(movePageBlock(pageBlockSettingsDefaults.contact, 1, -1)).toEqual(pageBlockSettingsDefaults.contact);
  });

  it("updates enabled state without allowing an ID replacement", () => {
    const updated = updatePageBlock(pageBlockSettingsDefaults.about, 1, { enabled: false, id: "faq" });
    expect(updated[1]).toEqual(expect.objectContaining({ id: "brand-positioning", enabled: false }));
  });

  it("uses the existing allowlisted options and fixed preview widths", () => {
    expect(pageBlockPreviewDevices.map((device) => device.width)).toEqual([390, 768, 1280]);
    expect(pageBlockBackgroundOptions.map((option) => option.value)).toEqual(["default", "clean", "soft-grid", "soft-blue", "deep-panel"]);
    expect(pageBlockMotionOptions.map((option) => option.value)).toEqual(["inherit", "none", "fade", "fly-up", "fly-left", "fly-right"]);
    expect(servicesBlockEditorConfig.definitions.find((definition) => definition.id === "service-cards")?.supportedLayouts).not.toContain("two-column");
  });

  it("submits the selected page and returns settings only after a successful response", async () => {
    const request = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ data: pageBlockSettingsDefaults }) });
    await expect(requestPageBlockSave("home", pageBlockSettingsDefaults.home, request)).resolves.toEqual(pageBlockSettingsDefaults);
    expect(JSON.parse(request.mock.calls[0][1].body)).toEqual({ page: "home", blocks: pageBlockSettingsDefaults.home });
  });

  it("rejects a failed save so the editor does not refresh its preview", async () => {
    const request = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "儲存失敗" }) });
    await expect(requestPageBlockSave("about", pageBlockSettingsDefaults.about, request)).rejects.toThrow("儲存失敗");
  });
});
