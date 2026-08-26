import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { POST } from "@/app/api/admin/content/[section]/publish/route";
import { siteContentSeed } from "@/data/site-content.seed";
import { rejectIfNotAdmin } from "@/lib/admin-auth";
import { getScopeValue } from "@/lib/content-scopes";
import { getContentWorkflowMutationRepository } from "@/lib/content-workflow-repository-factory";
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
jest.mock("@/lib/content-workflow-repository-factory", () => ({
  getContentWorkflowMutationRepository: jest.fn()
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockedRejectIfNotAdmin = jest.mocked(rejectIfNotAdmin);
const mockedGetRepository = jest.mocked(getContentWorkflowMutationRepository);
const mockedRevalidatePath = jest.mocked(revalidatePath);

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

function createPublishedSnapshot<TScope extends ContentScope>(
  scope: TScope
): EditorSnapshot<TScope> {
  return {
    scope,
    data: getScopeValue(siteContentSeed, scope),
    source: "published",
    draftRevision: null,
    publishedRevision: 2,
    draftUpdatedAt: null,
    publishedUpdatedAt: "2026-07-15T01:00:00.000Z"
  };
}

function requestFor(section: string, body: object | string): NextRequest {
  return new NextRequest(`http://localhost/api/admin/content/${section}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body)
  });
}

function context(section: string) {
  return { params: Promise.resolve({ section }) };
}

describe("admin content workflow publish route", () => {
  let repository: jest.Mocked<ContentWorkflowRepository>;
  const persistenceKeys = [
    "CONTENT_RUNTIME_ENVIRONMENT",
    "CONTENT_PERSISTENCE_DRIVER",
    "CONTENT_MUTATIONS_ENABLED",
    "CONTENT_MUTATIONS_PUBLISH_ENABLED",
    "CONTENT_MUTATIONS_ALLOWED_SCOPES",
    "CONTENT_DATABASE_RUNTIME_URL",
    "CONTENT_SITE_KEY"
  ] as const;
  const previousEnvironment = Object.fromEntries(
    persistenceKeys.map((key) => [key, process.env[key]])
  );

  beforeEach(() => {
    jest.clearAllMocks();
    repository = createRepository();
    mockedRejectIfNotAdmin.mockResolvedValue(null);
    mockedGetRepository.mockReturnValue(
      repository as unknown as ReturnType<typeof getContentWorkflowMutationRepository>
    );
    process.env.CONTENT_RUNTIME_ENVIRONMENT = "preview";
    process.env.CONTENT_PERSISTENCE_DRIVER = "database";
    process.env.CONTENT_MUTATIONS_ENABLED = "true";
    process.env.CONTENT_MUTATIONS_PUBLISH_ENABLED = "true";
    process.env.CONTENT_MUTATIONS_ALLOWED_SCOPES = "home,design,pageBlocks.home,pageBlocks.services,pageBlocks.about,pageBlocks.contact";
    process.env.CONTENT_DATABASE_RUNTIME_URL = "postgresql://fake@localhost/db";
    process.env.CONTENT_SITE_KEY = "test";
  });

  afterAll(() => {
    for (const key of persistenceKeys) {
      const value = previousEnvironment[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it("returns 401 before body parsing or repository access", async () => {
    mockedRejectIfNotAdmin.mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );

    const response = await POST(requestFor("home", "not-json"), context("home"));

    expect(response.status).toBe(401);
    expect(mockedGetRepository).not.toHaveBeenCalled();
    expect(repository.publishDraft).not.toHaveBeenCalled();
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("publishes a saved general-section Draft without resending content", async () => {
    const snapshot = createPublishedSnapshot("home");
    repository.publishDraft.mockResolvedValue(snapshot);

    const response = await POST(requestFor("home", {
      expectedDraftRevision: 2,
      expectedPublishedRevision: 1
    }), context("home"));

    expect(repository.publishDraft).toHaveBeenCalledWith({
      scope: "home",
      expectedDraftRevision: 2,
      expectedPublishedRevision: 1
    });
    expect(repository.publishDraft).toHaveBeenCalledTimes(1);
    await expect(response.json()).resolves.toEqual({ ok: true, snapshot });
  });

  it.each(["home", "services", "about", "contact"] as const)(
    "maps pageBlocks.%s for Publish and revalidates its public page",
    async (page) => {
      const scope = `pageBlocks.${page}` as const;
      repository.publishDraft.mockResolvedValue(createPublishedSnapshot(scope));
      const expectedPath = {
        home: "/",
        services: "/services",
        about: "/about",
        contact: "/contact"
      }[page];

      const response = await POST(requestFor("pageBlocks", {
        page,
        expectedDraftRevision: 2,
        expectedPublishedRevision: 1
      }), context("pageBlocks"));

      expect(response.status).toBe(200);
      expect(repository.publishDraft).toHaveBeenCalledWith({
        scope,
        expectedDraftRevision: 2,
        expectedPublishedRevision: 1
      });
      expect(mockedRevalidatePath).toHaveBeenCalledWith(expectedPath, "page");
      expect(mockedRevalidatePath).toHaveBeenCalledTimes(1);
      expect(repository.publishDraft.mock.invocationCallOrder[0]).toBeLessThan(
        mockedRevalidatePath.mock.invocationCallOrder[0]
      );
      await expect(response.json()).resolves.toEqual({
        ok: true,
        snapshot: createPublishedSnapshot(scope)
      });
    }
  );

  it("does not apply Page Block path revalidation to a general-section Publish", async () => {
    const snapshot = createPublishedSnapshot("home");
    repository.publishDraft.mockResolvedValue(snapshot);

    const response = await POST(requestFor("home", {
      expectedDraftRevision: 2,
      expectedPublishedRevision: 1
    }), context("home"));

    expect(response.status).toBe(200);
    expect(mockedRevalidatePath).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ ok: true, snapshot });
  });

  it.each([
    { expectedDraftRevision: 2, expectedPublishedRevision: 1, data: siteContentSeed.home },
    { expectedDraftRevision: 2, expectedPublishedRevision: 1, blocks: [] },
    { expectedDraftRevision: 2, expectedPublishedRevision: 1, scope: "home" },
    { expectedDraftRevision: 2, expectedPublishedRevision: 1, drafts: {} }
  ])("rejects content or metadata attached to Publish: %#", async (payload) => {
    const response = await POST(requestFor("home", payload), context("home"));

    expect(response.status).toBe(400);
    expect(repository.publishDraft).not.toHaveBeenCalled();
  });

  it.each([
    {},
    { expectedDraftRevision: 1 },
    { expectedPublishedRevision: 1 },
    { expectedDraftRevision: null, expectedPublishedRevision: 1 },
    { expectedDraftRevision: 0, expectedPublishedRevision: 1 },
    { expectedDraftRevision: 1.5, expectedPublishedRevision: 1 },
    { expectedDraftRevision: 1, expectedPublishedRevision: -1 },
    { expectedDraftRevision: 1, expectedPublishedRevision: "1" }
  ])("rejects invalid Publish revisions: %#", async (payload) => {
    const response = await POST(requestFor("home", payload), context("home"));

    expect(response.status).toBe(400);
    expect(repository.publishDraft).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(requestFor("home", "{"), context("home"));

    expect(response.status).toBe(400);
    expect(repository.publishDraft).not.toHaveBeenCalled();
  });

  it("returns safe revision conflict metadata without Draft content", async () => {
    repository.publishDraft.mockRejectedValue(new ContentRevisionConflictError({
      scope: "home",
      expectedDraftRevision: 1,
      currentDraftRevision: 2,
      expectedPublishedRevision: 1,
      currentPublishedRevision: 1
    }));

    const response = await POST(requestFor("home", {
      expectedDraftRevision: 1,
      expectedPublishedRevision: 1
    }), context("home"));
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual({
      ok: false,
      error: {
        code: "REVISION_CONFLICT",
        message: "Content changed since it was loaded",
        scope: "home",
        expectedDraftRevision: 1,
        currentDraftRevision: 2,
        expectedPublishedRevision: 1,
        currentPublishedRevision: 1
      }
    });
    expect(JSON.stringify(body)).not.toContain(siteContentSeed.home.hero.title);
    expect(mockedRevalidatePath).not.toHaveBeenCalled();
  });

  it.each([
    [new ContentDraftNotFoundError("pageBlocks.home"), 404],
    [new ContentStorageMutationError("site-content.json", new Error("private path")), 500]
  ])("does not revalidate when Page Block Publish fails", async (error, expectedStatus) => {
    repository.publishDraft.mockRejectedValue(error);

    const response = await POST(requestFor("pageBlocks", {
      page: "home",
      expectedDraftRevision: 1,
      expectedPublishedRevision: 1
    }), context("pageBlocks"));

    expect(response.status).toBe(expectedStatus);
    expect(mockedRevalidatePath).not.toHaveBeenCalled();
  });

  it("rejects unknown sections and pages before repository creation", async () => {
    const unknownSection = await POST(requestFor("__proto__", {
      expectedDraftRevision: 1,
      expectedPublishedRevision: 1
    }), context("__proto__"));
    const unknownPage = await POST(requestFor("pageBlocks", {
      page: "constructor",
      expectedDraftRevision: 1,
      expectedPublishedRevision: 1
    }), context("pageBlocks"));

    expect(unknownSection.status).toBe(404);
    expect(unknownPage.status).toBe(404);
    expect(mockedGetRepository).not.toHaveBeenCalled();
  });

  it("sets all private response headers on success", async () => {
    repository.publishDraft.mockResolvedValue(createPublishedSnapshot("home"));

    const response = await POST(requestFor("home", {
      expectedDraftRevision: 1,
      expectedPublishedRevision: 1
    }), context("home"));

    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("pragma")).toBe("no-cache");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(response.headers.get("vary")).toBe("Cookie");
  });
});
