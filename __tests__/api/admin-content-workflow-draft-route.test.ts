import { NextRequest, NextResponse } from "next/server";

import { DELETE, PUT } from "@/app/api/admin/content/[section]/draft/route";
import { siteContentSeed } from "@/data/site-content.seed";
import { rejectIfNotAdmin } from "@/lib/admin-auth";
import {
  MalformedContentEnvelopeError,
  UnknownContentSchemaVersionError
} from "@/lib/content-envelope";
import { getScopeValue } from "@/lib/content-scopes";
import { getContentWorkflowRepository } from "@/lib/content-store";
import {
  ContentDraftNotFoundError,
  ContentRevisionConflictError,
  ContentStorageMutationError
} from "@/lib/content-workflow-errors";
import type {
  ContentScope,
  ContentWorkflowRepository,
  EditorSnapshot
} from "@/types/content-workflow";

jest.mock("@/lib/admin-auth", () => ({ rejectIfNotAdmin: jest.fn() }));
jest.mock("@/lib/content-store", () => ({ getContentWorkflowRepository: jest.fn() }));

const mockedRejectIfNotAdmin = jest.mocked(rejectIfNotAdmin);
const mockedGetRepository = jest.mocked(getContentWorkflowRepository);

function createRepository(): jest.Mocked<ContentWorkflowRepository> {
  return {
    readPublished: jest.fn(),
    readEditor: jest.fn(),
    readPreview: jest.fn(),
    hasDrafts: jest.fn(),
    saveDraft: jest.fn(),
    publishDraft: jest.fn(),
    discardDraft: jest.fn()
  };
}

function createSnapshot<TScope extends ContentScope>(
  scope: TScope,
  source: "draft" | "published"
): EditorSnapshot<TScope> {
  return {
    scope,
    data: getScopeValue(siteContentSeed, scope),
    source,
    draftRevision: source === "draft" ? 1 : null,
    publishedRevision: 1,
    draftUpdatedAt: source === "draft" ? "2026-07-15T01:00:00.000Z" : null,
    publishedUpdatedAt: "2026-07-15T00:00:00.000Z"
  };
}

function requestFor(
  section: string,
  method: "PUT" | "DELETE",
  body: string
): NextRequest {
  return new NextRequest(`http://localhost/api/admin/content/${section}/draft`, {
    method,
    headers: { "Content-Type": "application/json" },
    body
  });
}

function jsonRequest(
  section: string,
  method: "PUT" | "DELETE",
  body: object
): NextRequest {
  return requestFor(section, method, JSON.stringify(body));
}

function context(section: string) {
  return { params: Promise.resolve({ section }) };
}

describe("admin content workflow draft route", () => {
  let repository: jest.Mocked<ContentWorkflowRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = createRepository();
    mockedRejectIfNotAdmin.mockResolvedValue(null);
    mockedGetRepository.mockReturnValue(
      repository as unknown as ReturnType<typeof getContentWorkflowRepository>
    );
  });

  it.each(["PUT", "DELETE"] as const)(
    "returns 401 before parsing or repository access for %s",
    async (method) => {
      mockedRejectIfNotAdmin.mockResolvedValue(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
      const request = requestFor("home", method, "not-json");

      const response = method === "PUT"
        ? await PUT(request, context("home"))
        : await DELETE(request, context("home"));

      expect(response.status).toBe(401);
      expect(mockedGetRepository).not.toHaveBeenCalled();
      expect(repository.saveDraft).not.toHaveBeenCalled();
      expect(repository.discardDraft).not.toHaveBeenCalled();
      expect(response.headers.get("cache-control")).toBe("private, no-store");
    }
  );

  it("passes a general section Draft payload to saveDraft", async () => {
    const snapshot = createSnapshot("home", "draft");
    repository.saveDraft.mockResolvedValue(snapshot);
    const payload = {
      data: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    };

    const response = await PUT(jsonRequest("home", "PUT", payload), context("home"));

    expect(repository.saveDraft).toHaveBeenCalledWith({
      scope: "home",
      value: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    await expect(response.json()).resolves.toEqual({ ok: true, snapshot });
  });

  it("passes Design data to the repository for canonical normalization", async () => {
    const snapshot = createSnapshot("design", "draft");
    repository.saveDraft.mockResolvedValue(snapshot);

    await PUT(jsonRequest("design", "PUT", {
      data: siteContentSeed.design,
      expectedDraftRevision: 2,
      expectedPublishedRevision: 3
    }), context("design"));

    expect(repository.saveDraft).toHaveBeenCalledWith({
      scope: "design",
      value: siteContentSeed.design,
      expectedDraftRevision: 2,
      expectedPublishedRevision: 3
    });
  });

  it.each(["home", "services", "about", "contact"] as const)(
    "passes only pageBlocks.%s blocks to saveDraft",
    async (page) => {
      const scope = `pageBlocks.${page}` as const;
      const snapshot = createSnapshot(scope, "draft");
      repository.saveDraft.mockResolvedValue(snapshot);
      const blocks = siteContentSeed.pageBlocks[page];

      const response = await PUT(jsonRequest("pageBlocks", "PUT", {
        page,
        blocks,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      }), context("pageBlocks"));

      expect(repository.saveDraft).toHaveBeenCalledWith({
        scope,
        value: blocks,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      });
      expect(repository.saveDraft).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    }
  );

  it("accepts an existing positive Draft revision", async () => {
    repository.saveDraft.mockResolvedValue(createSnapshot("home", "draft"));

    const response = await PUT(jsonRequest("home", "PUT", {
      data: siteContentSeed.home,
      expectedDraftRevision: 4,
      expectedPublishedRevision: 2
    }), context("home"));

    expect(response.status).toBe(200);
    expect(repository.saveDraft).toHaveBeenCalledWith(expect.objectContaining({
      expectedDraftRevision: 4,
      expectedPublishedRevision: 2
    }));
  });

  it.each([
    {},
    { data: {}, expectedDraftRevision: null },
    { data: {}, expectedPublishedRevision: 1 },
    { data: {}, expectedDraftRevision: 0, expectedPublishedRevision: 1 },
    { data: {}, expectedDraftRevision: 1.5, expectedPublishedRevision: 1 },
    { data: {}, expectedDraftRevision: null, expectedPublishedRevision: 0 },
    { data: {}, expectedDraftRevision: null, expectedPublishedRevision: "1" }
  ])("rejects missing or invalid Save revisions: %#", async (payload) => {
    const response = await PUT(jsonRequest("home", "PUT", payload), context("home"));

    expect(response.status).toBe(400);
    expect(repository.saveDraft).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON and non-object JSON", async () => {
    const malformed = await PUT(requestFor("home", "PUT", "{"), context("home"));
    const nonObject = await PUT(requestFor("home", "PUT", "[]"), context("home"));

    expect(malformed.status).toBe(400);
    expect(nonObject.status).toBe(400);
    expect(repository.saveDraft).not.toHaveBeenCalled();
  });

  it.each(["scope", "draftRevision", "publishedRevision", "updatedAt", "drafts"])(
    "rejects forbidden Save metadata field %s",
    async (field) => {
      const response = await PUT(jsonRequest("home", "PUT", {
        data: siteContentSeed.home,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1,
        [field]: "forbidden"
      }), context("home"));

      expect(response.status).toBe(400);
      expect(repository.saveDraft).not.toHaveBeenCalled();
    }
  );

  it("rejects a full Page Blocks object instead of treating it as target blocks", async () => {
    const response = await PUT(jsonRequest("pageBlocks", "PUT", {
      page: "home",
      blocks: siteContentSeed.pageBlocks,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    }), context("pageBlocks"));

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "UNPROCESSABLE_CONTENT" }
    });
    expect(repository.saveDraft).not.toHaveBeenCalled();
  });

  it("returns a Published snapshot after Discard", async () => {
    const snapshot = createSnapshot("home", "published");
    repository.discardDraft.mockResolvedValue(snapshot);

    const response = await DELETE(jsonRequest("home", "DELETE", {
      expectedDraftRevision: 2
    }), context("home"));

    expect(repository.discardDraft).toHaveBeenCalledWith({
      scope: "home",
      expectedDraftRevision: 2
    });
    await expect(response.json()).resolves.toEqual({ ok: true, snapshot });
  });

  it.each(["home", "services", "about", "contact"] as const)(
    "maps pageBlocks.%s for Discard",
    async (page) => {
      const scope = `pageBlocks.${page}` as const;
      repository.discardDraft.mockResolvedValue(createSnapshot(scope, "published"));

      const response = await DELETE(jsonRequest("pageBlocks", "DELETE", {
        page,
        expectedDraftRevision: 3
      }), context("pageBlocks"));

      expect(response.status).toBe(200);
      expect(repository.discardDraft).toHaveBeenCalledWith({
        scope,
        expectedDraftRevision: 3
      });
    }
  );

  it("rejects Published revision metadata on Discard", async () => {
    const response = await DELETE(jsonRequest("home", "DELETE", {
      expectedDraftRevision: 2,
      expectedPublishedRevision: 1
    }), context("home"));

    expect(response.status).toBe(400);
    expect(repository.discardDraft).not.toHaveBeenCalled();
  });

  it("maps a missing Draft to 404", async () => {
    repository.discardDraft.mockRejectedValue(new ContentDraftNotFoundError("home"));

    const response = await DELETE(jsonRequest("home", "DELETE", {
      expectedDraftRevision: 1
    }), context("home"));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: { code: "DRAFT_NOT_FOUND", message: "Draft not found", scope: "home" }
    });
  });

  it("maps a stale Discard revision to a safe 409 response", async () => {
    repository.discardDraft.mockRejectedValue(new ContentRevisionConflictError({
      scope: "home",
      expectedDraftRevision: 1,
      currentDraftRevision: 2,
      expectedPublishedRevision: null,
      currentPublishedRevision: 3
    }));

    const response = await DELETE(jsonRequest("home", "DELETE", {
      expectedDraftRevision: 1
    }), context("home"));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: {
        code: "REVISION_CONFLICT",
        message: "Content changed since it was loaded",
        scope: "home",
        expectedDraftRevision: 1,
        currentDraftRevision: 2,
        expectedPublishedRevision: null,
        currentPublishedRevision: 3
      }
    });
  });

  it.each([
    [new ContentStorageMutationError("site-content.json", new Error("private path")), "STORAGE_ERROR"],
    [new UnknownContentSchemaVersionError(99), "STORAGE_SCHEMA_ERROR"],
    [new MalformedContentEnvelopeError("private content"), "STORAGE_SCHEMA_ERROR"]
  ])("maps storage failures without leaking details", async (error, code) => {
    repository.saveDraft.mockRejectedValue(error);

    const response = await PUT(jsonRequest("home", "PUT", {
      data: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    }), context("home"));
    const serialized = JSON.stringify(await response.json());

    expect(response.status).toBe(500);
    expect(serialized).toContain(code);
    expect(serialized).not.toContain("private path");
    expect(serialized).not.toContain("private content");
    expect(serialized).not.toContain(JSON.stringify(siteContentSeed.home));
  });

  it("maps an unexpected failure to a generic 500 without stack or data", async () => {
    repository.saveDraft.mockRejectedValue(new Error("/secret/path and private Draft data"));

    const response = await PUT(jsonRequest("home", "PUT", {
      data: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    }), context("home"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      ok: false,
      error: { code: "INTERNAL_ERROR", message: "Unexpected server error" }
    });
    expect(JSON.stringify(body)).not.toContain("/secret/path");
  });

  it("sets private no-store headers on Save and Discard success", async () => {
    repository.saveDraft.mockResolvedValue(createSnapshot("home", "draft"));
    repository.discardDraft.mockResolvedValue(createSnapshot("home", "published"));

    const saved = await PUT(jsonRequest("home", "PUT", {
      data: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    }), context("home"));
    const discarded = await DELETE(jsonRequest("home", "DELETE", {
      expectedDraftRevision: 1
    }), context("home"));

    expect(saved.headers.get("cache-control")).toBe("private, no-store");
    expect(discarded.headers.get("cache-control")).toBe("private, no-store");
  });
});
