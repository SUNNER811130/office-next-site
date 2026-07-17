import { promises as fs, readFileSync } from "fs";
import os from "os";
import path from "path";

import {
  createPageBlockDiscardPayload,
  createPageBlockPublishPayload,
  createPageBlockSaveDraftPayload,
  discardPageBlockDraft,
  getPageBlockWorkflowScope,
  loadPageBlockEditorSnapshot,
  publishPageBlockDraft,
  savePageBlockDraft
} from "@/components/admin/page-block-editor/page-block-workflow-helpers";
import type { PageBlockEditorPage, PageBlockEditorSnapshot } from "@/components/admin/page-block-editor/page-block-editor-types";
import { pageBlockSettingsDefaults } from "@/lib/page-block-settings";
import { LocalFileContentWorkflowRepository } from "@/lib/content-workflow-repository";
import { ContentRevisionConflictError } from "@/lib/content-workflow-errors";
import { siteContentSeed } from "@/data/site-content.seed";

const pages = ["home", "services", "about", "contact"] as const;

function publishedSnapshot<TPage extends PageBlockEditorPage>(
  page: TPage
): PageBlockEditorSnapshot<TPage> {
  return {
    scope: getPageBlockWorkflowScope(page),
    data: pageBlockSettingsDefaults[page],
    source: "published",
    draftRevision: null,
    publishedRevision: 1,
    draftUpdatedAt: null,
    publishedUpdatedAt: "2026-07-16T01:00:00.000Z"
  };
}

function snapshotResponse<TPage extends PageBlockEditorPage>(
  snapshot: PageBlockEditorSnapshot<TPage>
): Response {
  return new Response(JSON.stringify({ ok: true, snapshot }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

describe("Page Block workflow client and UI contracts", () => {
  it.each(pages)("maps %s to its nested workflow scope", (page) => {
    expect(getPageBlockWorkflowScope(page)).toBe(`pageBlocks.${page}`);
  });

  it.each(pages)("loads only the %s EditorSnapshot through the page query", async (page) => {
    const snapshot = publishedSnapshot(page);
    const request = jest.fn().mockResolvedValue(snapshotResponse(snapshot));

    await expect(loadPageBlockEditorSnapshot(page, { request })).resolves.toEqual(snapshot);
    expect(request).toHaveBeenCalledWith(
      `/api/admin/content/pageBlocks/editor?page=${page}`,
      expect.objectContaining({ method: "GET", cache: "no-store", credentials: "same-origin" })
    );
    expect(request.mock.calls[0][1]).not.toHaveProperty("body");
  });

  it.each(pages)("saves only the %s blocks and expected revisions", async (page) => {
    const initial = publishedSnapshot(page);
    const draft = {
      ...initial,
      source: "draft" as const,
      draftRevision: 1,
      draftUpdatedAt: "2026-07-16T02:00:00.000Z"
    };
    const request = jest.fn().mockResolvedValue(snapshotResponse(draft));

    await expect(savePageBlockDraft(page, pageBlockSettingsDefaults[page], initial, { request })).resolves.toEqual(draft);
    expect(request.mock.calls[0][0]).toBe("/api/admin/content/pageBlocks/draft");
    expect(request.mock.calls[0][1].method).toBe("PUT");
    expect(JSON.parse(request.mock.calls[0][1].body)).toEqual(createPageBlockSaveDraftPayload(
      page,
      pageBlockSettingsDefaults[page],
      initial
    ));
    expect(request.mock.calls[0][0]).not.toBe("/api/admin/content/pageBlocks");
  });

  it("publishes revisions without resending blocks", async () => {
    const initial = publishedSnapshot("home");
    const published = { ...initial, publishedRevision: 2 };
    const request = jest.fn().mockResolvedValue(snapshotResponse(published));

    await publishPageBlockDraft("home", { draftRevision: 3, publishedRevision: 1 }, { request });
    const body = JSON.parse(request.mock.calls[0][1].body);
    expect(request.mock.calls[0][0]).toBe("/api/admin/content/pageBlocks/publish");
    expect(request.mock.calls[0][1].method).toBe("POST");
    expect(body).toEqual(createPageBlockPublishPayload("home", { draftRevision: 3, publishedRevision: 1 }));
    expect(body).not.toHaveProperty("blocks");
  });

  it("discards with only the page and expected Draft revision", async () => {
    const request = jest.fn().mockResolvedValue(snapshotResponse(publishedSnapshot("contact")));
    await discardPageBlockDraft("contact", 4, { request });

    expect(request.mock.calls[0][0]).toBe("/api/admin/content/pageBlocks/draft");
    expect(request.mock.calls[0][1].method).toBe("DELETE");
    expect(JSON.parse(request.mock.calls[0][1].body)).toEqual(createPageBlockDiscardPayload("contact", 4));
  });

  it("rejects a mismatched nested scope response", async () => {
    const request = jest.fn().mockResolvedValue(snapshotResponse(publishedSnapshot("services")));
    await expect(loadPageBlockEditorSnapshot("home", { request })).rejects.toThrow("伺服器回傳的內容格式無法辨識");
  });

  it("preserves only safe revision metadata for a 409 conflict", async () => {
    const request = jest.fn().mockResolvedValue(new Response(JSON.stringify({
      ok: false,
      error: {
        code: "REVISION_CONFLICT",
        message: "private path",
        currentDraftRevision: 5,
        currentPublishedRevision: 2
      }
    }), { status: 409 }));

    await expect(savePageBlockDraft("about", pageBlockSettingsDefaults.about, publishedSnapshot("about"), { request }))
      .rejects.toMatchObject({
        code: "REVISION_CONFLICT",
        message: "內容版本已在其他分頁變更。",
        revisions: expect.objectContaining({ currentDraftRevision: 5, currentPublishedRevision: 2 })
      });
  });

  it("loads four independent server snapshots without reading the raw content store", () => {
    for (const page of pages) {
      const source = readFileSync(path.join(process.cwd(), `app/admin/(dashboard)/pages/${page}/page.tsx`), "utf8");
      expect(source).toContain(`readEditor("pageBlocks.${page}")`);
      expect(source).toContain("initialSnapshot={snapshot}");
      expect(source).not.toContain("readContent");
      expect(source).not.toContain("content.pageBlocks");
    }
  });

  it("uses shared workflow actions, conflict UI, status, and confirmation dialog", () => {
    const editor = readFileSync(path.join(process.cwd(), "components/admin/page-block-editor/page-block-editor.tsx"), "utf8");
    const actions = readFileSync(path.join(process.cwd(), "components/admin/content-workflow/content-workflow-actions.tsx"), "utf8");
    expect(editor).toContain("<ContentWorkflowActions");
    expect(editor).toContain("<ContentWorkflowConfirmDialog");
    expect(actions).toContain("<ContentWorkflowStatus");
    expect(actions).toContain("<ContentWorkflowConflict");
    expect(actions).toContain("發布只影響目前頁的 Page Blocks");
    expect(actions).toContain("尚未儲存的本地修改也會消失");
  });

  it("switches between Published and authenticated Draft Preview without a public Draft query", () => {
    const editor = readFileSync(path.join(process.cwd(), "components/admin/page-block-editor/page-block-editor.tsx"), "utf8");
    const preview = readFileSync(path.join(process.cwd(), "components/admin/page-block-editor/page-block-preview.tsx"), "utf8");
    const frame = readFileSync(path.join(process.cwd(), "components/admin/preview/admin-preview-frame.tsx"), "utf8");
    expect(preview).toContain("<AdminPreviewFrame");
    expect(frame).toContain("`/admin/preview/${target}`");
    expect(frame).toContain("disabled={!hasDraft}");
    expect(editor).toContain("usePageBlockWorkflow(config.page, initialSnapshot, () => setPreviewKey");
    expect(editor).not.toContain("requestPageBlockSave");
    expect(editor).not.toContain("/api/admin/content/pageBlocks");
    expect(frame).not.toContain("draft=");
  });

  it("guards duplicate requests, aborts on unmount, and reloads without saving", () => {
    const hook = readFileSync(path.join(process.cwd(), "components/admin/page-block-editor/use-page-block-workflow.ts"), "utf8");
    expect(hook).toContain("if (busyRef.current) return null");
    expect(hook).toContain("controllerRef.current?.abort()");
    expect(hook).toContain("setConflict({ revisions: caught.revisions })");
    const reload = hook.slice(hook.indexOf("const reload ="), hook.indexOf("return {", hook.indexOf("const reload =")));
    expect(reload).toContain("loadPageBlockEditorSnapshot");
    expect(reload).toContain("getReloadedWorkflowState");
    expect(reload).not.toContain("savePageBlockDraft");
    expect(reload).not.toContain("publishPageBlockDraft");
    expect(hook).not.toContain("retry");
  });

  it("retains button, busy, live status, checkbox/select labels, and shared dialog isolation", () => {
    const editor = readFileSync(path.join(process.cwd(), "components/admin/page-block-editor/page-block-editor.tsx"), "utf8");
    const controls = readFileSync(path.join(process.cwd(), "components/admin/page-block-editor/page-block-control-card.tsx"), "utf8");
    const actions = readFileSync(path.join(process.cwd(), "components/admin/content-workflow/content-workflow-actions.tsx"), "utf8");
    const status = readFileSync(path.join(process.cwd(), "components/admin/content-workflow/content-workflow-status.tsx"), "utf8");
    const dialog = readFileSync(path.join(process.cwd(), "components/admin/content-workflow/content-workflow-confirm-dialog.tsx"), "utf8");
    expect(editor).toContain('type="button"');
    expect(controls).toContain('type="checkbox"');
    expect(controls).toContain("<select");
    expect(actions).toContain("aria-busy={busy}");
    expect(status).toContain('aria-live="polite"');
    expect(dialog).toContain('role="alertdialog"');
    expect(dialog).toContain('aria-modal="true"');
    expect(dialog).toContain("isolateDialogBackground");
    expect(dialog).toContain("trapDialogTab");
    expect(dialog).toContain('event.key === "Escape"');
  });

  it("contains no any or hydration suppression in the L5 workflow implementation", () => {
    const paths = [
      "components/admin/page-block-editor/page-block-editor.tsx",
      "components/admin/page-block-editor/page-block-workflow-helpers.ts",
      "components/admin/page-block-editor/use-page-block-workflow.ts"
    ];
    for (const file of paths) {
      const source = readFileSync(path.join(process.cwd(), file), "utf8");
      expect(source).not.toMatch(/\bany\b/);
      expect(source).not.toContain("suppressHydrationWarning");
    }
  });
});

describe("Page Block workflow repository isolation", () => {
  let directory = "";

  afterEach(async () => {
    if (directory) await fs.rm(directory, { recursive: true, force: true });
  });

  it("keeps GET read-only, saves/publishes one nested scope, and discards another in temp persistence", async () => {
    directory = await fs.mkdtemp(path.join(os.tmpdir(), "office-next-page-block-l5-"));
    const persistencePath = path.join(directory, "site-content.json");
    await fs.writeFile(persistencePath, JSON.stringify(siteContentSeed, null, 2), "utf8");
    const repository = new LocalFileContentWorkflowRepository({
      persistencePath,
      seed: siteContentSeed,
      clock: () => "2026-07-16T03:00:00.000Z"
    });
    const beforeRead = await fs.readFile(persistencePath, "utf8");

    for (const page of pages) {
      await expect(repository.readEditor(`pageBlocks.${page}`)).resolves.toMatchObject({
        scope: `pageBlocks.${page}`,
        source: "published",
        draftRevision: null,
        data: pageBlockSettingsDefaults[page]
      });
    }
    await expect(fs.readFile(persistencePath, "utf8")).resolves.toBe(beforeRead);

    const homeBlocks = pageBlockSettingsDefaults.home.map((block) => (
      block.id === "faq" ? { ...block, enabled: false } : block
    ));
    const homeDraft = await repository.saveDraft({
      scope: "pageBlocks.home",
      value: homeBlocks,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    expect(homeDraft).toMatchObject({ source: "draft", draftRevision: 1, publishedRevision: 1 });
    expect((await repository.readPublished()).content.pageBlocks.home).toEqual(siteContentSeed.pageBlocks.home);

    await repository.publishDraft({
      scope: "pageBlocks.home",
      expectedDraftRevision: 1,
      expectedPublishedRevision: 1
    });
    const published = await repository.readPublished();
    expect(published.content.pageBlocks.home.find((block) => block.id === "faq")?.enabled).toBe(false);
    expect(published.content.pageBlocks.services).toEqual(siteContentSeed.pageBlocks.services);
    expect(published.content.pageBlocks.about).toEqual(siteContentSeed.pageBlocks.about);
    expect(published.content.pageBlocks.contact).toEqual(siteContentSeed.pageBlocks.contact);

    const servicesDraft = await repository.saveDraft({
      scope: "pageBlocks.services",
      value: pageBlockSettingsDefaults.services,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    await repository.discardDraft({
      scope: "pageBlocks.services",
      expectedDraftRevision: servicesDraft.draftRevision!
    });
    await expect(repository.readEditor("pageBlocks.services")).resolves.toMatchObject({
      source: "published",
      draftRevision: null
    });
  });

  it("rejects stale Page Block revisions without overwriting the local target", async () => {
    directory = await fs.mkdtemp(path.join(os.tmpdir(), "office-next-page-block-conflict-"));
    const persistencePath = path.join(directory, "site-content.json");
    await fs.writeFile(persistencePath, JSON.stringify(siteContentSeed, null, 2), "utf8");
    const repository = new LocalFileContentWorkflowRepository({ persistencePath, seed: siteContentSeed });
    await repository.saveDraft({
      scope: "pageBlocks.contact",
      value: pageBlockSettingsDefaults.contact,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    await expect(repository.saveDraft({
      scope: "pageBlocks.contact",
      value: pageBlockSettingsDefaults.contact,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).rejects.toBeInstanceOf(ContentRevisionConflictError);
    await expect(repository.readEditor("pageBlocks.contact")).resolves.toMatchObject({
      source: "draft",
      draftRevision: 1
    });
  });
});
