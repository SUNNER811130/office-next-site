import { readFileSync } from "fs";
import path from "path";

import {
  formatWorkflowTime,
  getWorkflowActionAvailability,
  getReloadedWorkflowState,
  workflowScopeLabels
} from "@/components/admin/content-workflow/content-workflow-helpers";
import {
  claimDialogConfirmation,
  isolateDialogBackground,
  trapDialogTab
} from "@/components/admin/content-workflow/content-workflow-dialog-helpers";
import {
  syncExternalRichTextValue,
  type RichTextEditorSyncTarget
} from "@/components/admin/rich-text-editor-helpers";
import { siteContentSeed } from "@/data/site-content.seed";
import type { EditorSnapshot } from "@/types/content-workflow";

describe("content workflow UI contracts", () => {
  it("keeps Contact and Social labels and routes independent", () => {
    expect(workflowScopeLabels.contact).toBe("聯絡資訊");
    expect(workflowScopeLabels.social).toBe("社群連結");
    const source = readFileSync(path.join(process.cwd(), "app/admin/(dashboard)/contact/page.tsx"), "utf8");
    expect(source).toContain('readEditor("contact")');
    expect(source).toContain('readEditor("social")');
    expect(source).toContain("contactSnapshot");
    expect(source).toContain("socialSnapshot");
  });

  it("disables Publish without Draft, while dirty, during requests, and after conflicts", () => {
    expect(getWorkflowActionAvailability({ hasDraft: false, dirty: false, operation: null, hasConflict: false }).publishDisabled).toBe(true);
    expect(getWorkflowActionAvailability({ hasDraft: true, dirty: true, operation: null, hasConflict: false }).publishDisabled).toBe(true);
    expect(getWorkflowActionAvailability({ hasDraft: true, dirty: false, operation: "saving", hasConflict: false }).publishDisabled).toBe(true);
    expect(getWorkflowActionAvailability({ hasDraft: true, dirty: false, operation: null, hasConflict: true }).publishDisabled).toBe(true);
    expect(getWorkflowActionAvailability({ hasDraft: true, dirty: false, operation: null, hasConflict: false }).publishDisabled).toBe(false);
  });

  it("disables Discard without Draft and Save without local changes", () => {
    const availability = getWorkflowActionAvailability({ hasDraft: false, dirty: false, operation: null, hasConflict: false });
    expect(availability.discardDisabled).toBe(true);
    expect(availability.saveDisabled).toBe(true);
  });

  it("formats valid revision timestamps and safely handles invalid values", () => {
    expect(formatWorkflowTime("invalid")).toBe("—");
    expect(formatWorkflowTime(null)).toBe("—");
    expect(formatWorkflowTime("2026-07-16T01:00:00.000Z")).not.toBe("—");
  });

  it("uses server EditorSnapshot pages and does not touch Page Block pages", () => {
    const sections = ["brand", "home", "founder", "services", "testimonials", "faq", "design"];
    for (const section of sections) {
      const source = readFileSync(path.join(process.cwd(), `app/admin/(dashboard)/${section}/page.tsx`), "utf8");
      expect(source).toContain(`readEditor("${section}")`);
      expect(source).not.toContain("readContent");
    }
    const pageBlockSource = readFileSync(path.join(process.cwd(), "components/admin/page-block-editor/page-block-editor.tsx"), "utf8");
    expect(pageBlockSource).toContain("requestPageBlockSave");
  });

  it("keeps confirmation, accessibility, conflict, and Published-only preview copy explicit", () => {
    const actions = readFileSync(path.join(process.cwd(), "components/admin/content-workflow/content-workflow-actions.tsx"), "utf8");
    const dialog = readFileSync(path.join(process.cwd(), "components/admin/content-workflow/content-workflow-confirm-dialog.tsx"), "utf8");
    const status = readFileSync(path.join(process.cwd(), "components/admin/content-workflow/content-workflow-status.tsx"), "utf8");
    const design = readFileSync(path.join(process.cwd(), "components/admin/design-editor.tsx"), "utf8");
    expect(actions).toContain("發布後公開網站才會更新");
    expect(actions).toContain("尚未儲存的本地修改也會消失");
    expect(dialog).toContain('role="alertdialog"');
    expect(dialog).toContain('aria-modal="true"');
    expect(dialog).toContain('className="fixed inset-0 z-[100]');
    expect(dialog).toContain("pointer-events-auto");
    expect(dialog).toContain("event.preventDefault();");
    expect(dialog).toContain("isolateDialogBackground(document, portalRoot)");
    expect(dialog).toContain("trapDialogTab(focusableElements, document.activeElement, event.shiftKey)");
    expect(dialog).toContain('event.key === "Escape"');
    expect(dialog).toContain("onCancel();");
    expect(dialog).toContain("onConfirm();");
    expect(dialog).toContain("trigger.focus()");
    expect(dialog).toContain("cancelRef.current?.focus()");
    expect(dialog).toContain("disabled={confirming}");
    expect(dialog).toContain("aria-busy={confirming}");
    expect(dialog).toContain("createPortal(");
    expect(status).toContain('aria-live="polite"');
    expect(design).toContain("目前預覽顯示已發布版本；草稿預覽將於 Preview 功能完成後提供。");
  });

  it("isolates and restores background inert state and body scrolling", () => {
    const originalHTMLElement = global.HTMLElement;
    class TestHTMLElement {
      inert = false;
    }
    Object.defineProperty(global, "HTMLElement", { configurable: true, value: TestHTMLElement });

    try {
      const portalRoot = new TestHTMLElement() as unknown as HTMLElement;
      const originallyActive = new TestHTMLElement() as unknown as HTMLElement;
      const originallyInert = new TestHTMLElement() as unknown as HTMLElement;
      originallyInert.inert = true;
      const body = {
        children: [originallyActive, portalRoot, originallyInert],
        style: { overflow: "auto" }
      };

      const restore = isolateDialogBackground({ body } as unknown as Document, portalRoot);
      expect(originallyActive.inert).toBe(true);
      expect(originallyInert.inert).toBe(true);
      expect(body.style.overflow).toBe("hidden");

      restore();
      expect(originallyActive.inert).toBe(false);
      expect(originallyInert.inert).toBe(true);
      expect(body.style.overflow).toBe("auto");
    } finally {
      if (originalHTMLElement) {
        Object.defineProperty(global, "HTMLElement", { configurable: true, value: originalHTMLElement });
      } else {
        Reflect.deleteProperty(global, "HTMLElement");
      }
    }
  });

  it("traps forward and reverse Tab focus inside the dialog", () => {
    const focusLog: string[] = [];
    const first = { focus: () => focusLog.push("first") } as unknown as HTMLElement;
    const middle = { focus: () => focusLog.push("middle") } as unknown as HTMLElement;
    const last = { focus: () => focusLog.push("last") } as unknown as HTMLElement;
    const focusable = [first, middle, last];

    expect(trapDialogTab(focusable, last, false)).toBe(true);
    expect(trapDialogTab(focusable, first, true)).toBe(true);
    expect(trapDialogTab(focusable, middle, false)).toBe(false);
    expect(focusLog).toEqual(["first", "last"]);
  });

  it("allows a confirmation callback to be claimed only once", () => {
    const guard = { current: false };
    expect(claimDialogConfirmation(guard)).toBe(true);
    expect(claimDialogConfirmation(guard)).toBe(false);
  });

  it("keeps Publish, Discard, Reload, and Reset on the shared dialog", () => {
    const actions = readFileSync(path.join(process.cwd(), "components/admin/content-workflow/content-workflow-actions.tsx"), "utf8");
    const editor = readFileSync(path.join(process.cwd(), "components/admin/section-editor.tsx"), "utf8");
    expect(actions.match(/<ContentWorkflowConfirmDialog/g)).toHaveLength(3);
    expect(editor.match(/<ContentWorkflowConfirmDialog/g)).toHaveLength(1);
    expect(actions).toContain("confirm(onPublish)");
    expect(actions).toContain("confirm(onDiscard)");
    expect(editor).toContain('id="reset-design"');
  });

  it("guards duplicate requests, unmount updates, and conflict retries in the shared hook", () => {
    const hook = readFileSync(path.join(process.cwd(), "components/admin/content-workflow/use-content-workflow.ts"), "utf8");
    expect(hook).toContain("if (busyRef.current) return null");
    expect(hook).toContain("controllerRef.current?.abort()");
    expect(hook).toContain("if (!mountedRef.current) return");
    expect(hook).toContain("setConflict({ revisions: caught.revisions })");
    expect(hook).not.toContain("retry");
  });

  it("applies a reloaded server snapshot as clean, conflict-free local state without saving", () => {
    const snapshot: EditorSnapshot<"brand"> = {
      scope: "brand",
      data: { ...siteContentSeed.brand, name: "Server Draft A" },
      source: "draft",
      draftRevision: 2,
      publishedRevision: 1,
      draftUpdatedAt: "2026-07-16T02:00:00.000Z",
      publishedUpdatedAt: "2026-07-16T01:00:00.000Z"
    };

    expect(getReloadedWorkflowState(snapshot)).toEqual({
      snapshot,
      value: snapshot.data,
      dirty: false,
      conflict: null,
      error: "",
      notice: "idle"
    });

    const hook = readFileSync(path.join(process.cwd(), "components/admin/content-workflow/use-content-workflow.ts"), "utf8");
    const reloadBlock = hook.slice(hook.indexOf("const reload ="), hook.indexOf("return {", hook.indexOf("const reload =")));
    expect(reloadBlock).toContain("loadEditorSnapshot");
    expect(reloadBlock).toContain("getReloadedWorkflowState");
    expect(reloadBlock).not.toContain("saveDraft(");
    expect(reloadBlock).not.toContain("publishDraft(");
  });

  it("syncs changed external rich text without emitting updates or repeating equal content", () => {
    let html = "<p>CONFLICT B</p>";
    const setContent = jest.fn((content: string, options: { emitUpdate: false }) => {
      html = content;
      return true;
    });
    const editor: RichTextEditorSyncTarget = {
      isDestroyed: false,
      getHTML: () => html,
      commands: { setContent }
    };

    expect(syncExternalRichTextValue(editor, "<p>Server Draft A</p>")).toBe(true);
    expect(setContent).toHaveBeenCalledWith("<p>Server Draft A</p>", { emitUpdate: false });
    expect(syncExternalRichTextValue(editor, "<p>Server Draft A</p>")).toBe(false);
    expect(setContent).toHaveBeenCalledTimes(1);
  });

  it("does not sync a missing or destroyed rich text editor", () => {
    const setContent = jest.fn(() => true);
    const destroyed: RichTextEditorSyncTarget = {
      isDestroyed: true,
      getHTML: () => "<p>local</p>",
      commands: { setContent }
    };

    expect(syncExternalRichTextValue(null, "<p>server</p>")).toBe(false);
    expect(syncExternalRichTextValue(destroyed, "<p>server</p>")).toBe(false);
    expect(setContent).not.toHaveBeenCalled();
  });

  it("keeps Tiptap client-only rendering and normal user updates", () => {
    const source = readFileSync(path.join(process.cwd(), "components/admin/rich-text-editor.tsx"), "utf8");
    expect(source).toContain("immediatelyRender: false");
    expect(source).toContain("syncExternalRichTextValue(editor, value)");
    expect(source).toContain("onChange(editor.getHTML())");
    expect(source).not.toContain("suppressHydrationWarning");
    expect(source).not.toMatch(/\bany\b/);
  });

  it("maps Publish QA fields to public routes and preserves Published-only reads", () => {
    const home = readFileSync(path.join(process.cwd(), "app/page.tsx"), "utf8");
    const about = readFileSync(path.join(process.cwd(), "app/about/page.tsx"), "utf8");
    const header = readFileSync(path.join(process.cwd(), "components/layout/header.tsx"), "utf8");
    const store = readFileSync(path.join(process.cwd(), "lib/content-store.ts"), "utf8");

    expect(home).toContain("{content.home.hero.title}");
    expect(about).toContain("title={content.brand.name}");
    expect(header).toContain("aria-label={`返回 ${content.brand.name} 首頁`}");
    expect(store).toContain("noStore();");
    expect(store).toContain("repository.readPublished()");
  });
});
