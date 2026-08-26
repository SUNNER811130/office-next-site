import {
  ContentWorkflowClientError,
  adminWorkflowSections,
  discardDraft,
  isRevisionConflict,
  loadEditorSnapshot,
  parseWorkflowResponse,
  publishDraft,
  resetDraft,
  saveDraft
} from "@/lib/content-workflow-client";
import { siteContentSeed } from "@/data/site-content.seed";
import type { ContentScope, EditorSnapshot } from "@/types/content-workflow";

const publishedBrand: EditorSnapshot<"brand"> = {
  scope: "brand",
  data: siteContentSeed.brand,
  source: "published",
  draftRevision: null,
  publishedRevision: 7,
  draftUpdatedAt: null,
  publishedUpdatedAt: "2026-07-15T01:00:00.000Z"
};

const draftBrand: EditorSnapshot<"brand"> = {
  ...publishedBrand,
  source: "draft",
  draftRevision: 3,
  draftUpdatedAt: "2026-07-16T01:00:00.000Z"
};

function response<TScope extends ContentScope>(
  snapshot: EditorSnapshot<TScope>,
  status = 200
) {
  return new Response(JSON.stringify({ ok: true, snapshot }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

describe("content workflow client", () => {
  afterEach(() => jest.restoreAllMocks());

  it("allowlists only the L4 general editor sections", () => {
    expect(adminWorkflowSections).toEqual([
      "brand", "home", "founder", "services", "testimonials", "faq", "contact", "social", "design"
    ]);
    expect(adminWorkflowSections).not.toContain("cases");
  });

  it("loads one editor snapshot without creating a draft", async () => {
    const request = jest.spyOn(global, "fetch").mockResolvedValue(response(publishedBrand));
    await expect(loadEditorSnapshot("brand")).resolves.toEqual(publishedBrand);
    expect(request).toHaveBeenCalledWith("/api/admin/content/brand/editor", expect.objectContaining({ method: "GET", cache: "no-store" }));
    expect(request.mock.calls[0][1]).not.toHaveProperty("body");
  });

  it("saves data and both expected revisions to the draft route", async () => {
    const request = jest.spyOn(global, "fetch").mockResolvedValue(response(draftBrand));
    await expect(saveDraft("brand", siteContentSeed.brand, publishedBrand)).resolves.toEqual(draftBrand);
    expect(request.mock.calls[0][0]).toBe("/api/admin/content/brand/draft");
    expect(request.mock.calls[0][1]?.method).toBe("PUT");
    expect(JSON.parse(String(request.mock.calls[0][1]?.body))).toEqual({
      data: siteContentSeed.brand,
      expectedDraftRevision: null,
      expectedPublishedRevision: 7
    });
  });

  it("publishes revisions without resending data", async () => {
    const request = jest.spyOn(global, "fetch").mockResolvedValue(response(publishedBrand));
    await publishDraft("brand", { draftRevision: 3, publishedRevision: 7 });
    const body = JSON.parse(String(request.mock.calls[0][1]?.body));
    expect(request.mock.calls[0][0]).toBe("/api/admin/content/brand/publish");
    expect(request.mock.calls[0][1]?.method).toBe("POST");
    expect(body).toEqual({ expectedDraftRevision: 3, expectedPublishedRevision: 7 });
    expect(body).not.toHaveProperty("data");
  });

  it("discards with only the expected Draft revision", async () => {
    const request = jest.spyOn(global, "fetch").mockResolvedValue(response(publishedBrand));
    await discardDraft("brand", 3);
    expect(request.mock.calls[0][0]).toBe("/api/admin/content/brand/draft");
    expect(request.mock.calls[0][1]?.method).toBe("DELETE");
    expect(JSON.parse(String(request.mock.calls[0][1]?.body))).toEqual({ expectedDraftRevision: 3 });
  });

  it("resets through the explicit endpoint without sending Client content", async () => {
    const designSnapshot: EditorSnapshot<"design"> = {
      scope: "design",
      data: siteContentSeed.design,
      source: "draft",
      draftRevision: 3,
      publishedRevision: 7,
      draftUpdatedAt: "2026-07-16T01:00:00.000Z",
      publishedUpdatedAt: "2026-07-15T01:00:00.000Z"
    };
    const request = jest.spyOn(global, "fetch").mockResolvedValue(response(designSnapshot));
    await resetDraft("design", designSnapshot);
    const body = JSON.parse(String(request.mock.calls[0][1]?.body));
    expect(request.mock.calls[0][0]).toBe("/api/admin/content/design/reset-draft");
    expect(request.mock.calls[0][1]?.method).toBe("POST");
    expect(body).toEqual({ expectedDraftRevision: 3, expectedPublishedRevision: 7 });
    expect(body).not.toHaveProperty("data");
  });

  it("keeps scopeUpdatedAt-derived published metadata unchanged", () => {
    expect(parseWorkflowResponse("brand", response(publishedBrand), { ok: true, snapshot: publishedBrand }).publishedUpdatedAt).toBe("2026-07-15T01:00:00.000Z");
  });

  it("recognizes a 409 revision conflict and exposes only safe revision metadata", () => {
    const body = {
      ok: false,
      error: {
        code: "REVISION_CONFLICT",
        message: "internal details must not surface",
        expectedDraftRevision: 2,
        currentDraftRevision: 3,
        expectedPublishedRevision: 6,
        currentPublishedRevision: 7
      }
    };
    try {
      parseWorkflowResponse("brand", new Response(JSON.stringify(body), { status: 409 }), body);
      throw new Error("Expected conflict");
    } catch (caught: unknown) {
      expect(isRevisionConflict(caught)).toBe(true);
      expect(caught).toBeInstanceOf(ContentWorkflowClientError);
      expect((caught as ContentWorkflowClientError).message).toBe("內容版本已在其他分頁變更。");
      expect((caught as ContentWorkflowClientError).revisions).toEqual({
        expectedDraftRevision: 2,
        currentDraftRevision: 3,
        expectedPublishedRevision: 6,
        currentPublishedRevision: 7
      });
    }
  });

  it("rejects mismatched scopes and malformed success envelopes", () => {
    expect(() => parseWorkflowResponse("home", response(publishedBrand), { ok: true, snapshot: publishedBrand })).toThrow("伺服器回傳的內容格式無法辨識");
    expect(() => parseWorkflowResponse("brand", response(publishedBrand), { ok: true })).toThrow("伺服器回傳的內容格式無法辨識");
  });

  it("does not expose server internals for failed responses", () => {
    const body = { ok: false, error: { code: "INTERNAL_ERROR", message: "secret persistence path" } };
    expect(() => parseWorkflowResponse("brand", new Response("", { status: 500 }), body)).toThrow("伺服器暫時無法處理內容");
    expect(() => parseWorkflowResponse("brand", new Response("", { status: 500 }), body)).not.toThrow("secret persistence path");
  });
});
