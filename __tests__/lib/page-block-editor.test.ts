import { aboutBlockEditorConfig } from "@/components/admin/about-block-editor";
import { contactBlockEditorConfig } from "@/components/admin/contact-block-editor";
import { movePageBlock, updatePageBlock } from "@/components/admin/page-block-editor/page-block-editor-helpers";
import { pageBlockBackgroundOptions, pageBlockMotionOptions, pageBlockPreviewDevices } from "@/components/admin/page-block-editor/page-block-editor-options";
import {
  createPageBlockSaveDraftPayload,
  resetPageBlockDraft,
  savePageBlockDraft
} from "@/components/admin/page-block-editor/page-block-workflow-helpers";
import type { PageBlockEditorSnapshot } from "@/components/admin/page-block-editor/page-block-editor-types";
import { homeBlockEditorConfig } from "@/components/admin/home-block-editor";
import { servicesBlockEditorConfig } from "@/components/admin/services-block-editor";
import { pageBlockSettingsDefaults } from "@/lib/page-block-settings";

describe("Shared page block editor", () => {
  const publishedHome: PageBlockEditorSnapshot<"home"> = {
    scope: "pageBlocks.home",
    data: pageBlockSettingsDefaults.home,
    source: "published",
    draftRevision: null,
    publishedRevision: 1,
    draftUpdatedAt: null,
    publishedUpdatedAt: "2026-07-16T01:00:00.000Z"
  };

  it("keeps page-specific wrappers declarative and correctly scoped", () => {
    expect([homeBlockEditorConfig.page, servicesBlockEditorConfig.page, aboutBlockEditorConfig.page, contactBlockEditorConfig.page]).toEqual(["home", "services", "about", "contact"]);
    expect([homeBlockEditorConfig.previewPath, servicesBlockEditorConfig.previewPath, aboutBlockEditorConfig.previewPath, contactBlockEditorConfig.previewPath]).toEqual(["/", "/services", "/about", "/contact"]);
    expect([homeBlockEditorConfig.defaultBlocks, servicesBlockEditorConfig.defaultBlocks, aboutBlockEditorConfig.defaultBlocks, contactBlockEditorConfig.defaultBlocks]).toEqual([
      pageBlockSettingsDefaults.home, pageBlockSettingsDefaults.services, pageBlockSettingsDefaults.about, pageBlockSettingsDefaults.contact
    ]);
  });

  it("creates a nested Draft payload containing only the selected page, blocks, and revisions", () => {
    const payload = createPageBlockSaveDraftPayload("contact", pageBlockSettingsDefaults.contact, {
      draftRevision: null,
      publishedRevision: 4
    });
    expect(payload).toEqual({
      page: "contact",
      blocks: pageBlockSettingsDefaults.contact,
      expectedDraftRevision: null,
      expectedPublishedRevision: 4
    });
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

  it("submits the selected page to the Draft route and returns its snapshot", async () => {
    const draftHome: PageBlockEditorSnapshot<"home"> = {
      ...publishedHome,
      source: "draft",
      draftRevision: 1,
      draftUpdatedAt: "2026-07-16T02:00:00.000Z"
    };
    const request = jest.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true, snapshot: draftHome })));
    await expect(savePageBlockDraft("home", pageBlockSettingsDefaults.home, publishedHome, { request })).resolves.toEqual(draftHome);
    expect(request.mock.calls[0][0]).toBe("/api/admin/content/pageBlocks/draft");
    expect(JSON.parse(request.mock.calls[0][1].body)).toEqual({
      page: "home",
      blocks: pageBlockSettingsDefaults.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
  });

  it("rejects a failed Draft save with a safe message", async () => {
    const request = jest.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false, error: { code: "INTERNAL_ERROR", message: "secret" } }), { status: 500 }));
    await expect(savePageBlockDraft("home", pageBlockSettingsDefaults.home, publishedHome, { request })).rejects.toThrow("伺服器暫時無法處理內容");
  });

  it("submits Reset revisions without Client-provided default blocks", async () => {
    const request = jest.fn().mockResolvedValue(new Response(JSON.stringify({
      ok: true,
      snapshot: publishedHome
    })));
    await resetPageBlockDraft("home", publishedHome, { request });
    expect(request.mock.calls[0][0]).toBe("/api/admin/content/pageBlocks/reset-draft");
    expect(JSON.parse(request.mock.calls[0][1].body)).toEqual({
      page: "home",
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
  });
});
