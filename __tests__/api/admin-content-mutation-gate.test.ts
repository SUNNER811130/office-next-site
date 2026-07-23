import { NextRequest, NextResponse } from "next/server";

import { GET as getEditor } from "@/app/api/admin/content/[section]/editor/route";
import { DELETE as discardDraft, PUT as saveDraft } from "@/app/api/admin/content/[section]/draft/route";
import { POST as publishDraft } from "@/app/api/admin/content/[section]/publish/route";
import { PUT as legacyPut } from "@/app/api/admin/content/[section]/route";
import { siteContentSeed } from "@/data/site-content.seed";
import { rejectIfNotAdmin } from "@/lib/admin-auth";
import {
  getContentWorkflowRepository,
  updateContentSection,
  updatePageBlockPage
} from "@/lib/content-store";
import type { ContentWorkflowRepository, EditorSnapshot } from "@/types/content-workflow";

jest.mock("@/lib/admin-auth", () => ({ rejectIfNotAdmin: jest.fn() }));
jest.mock("@/lib/content-store", () => ({
  getContentWorkflowRepository: jest.fn(),
  readContent: jest.fn(),
  updateContentSection: jest.fn(),
  updatePageBlockPage: jest.fn()
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockedRejectIfNotAdmin = jest.mocked(rejectIfNotAdmin);
const mockedGetRepository = jest.mocked(getContentWorkflowRepository);
const mockedUpdateContentSection = jest.mocked(updateContentSection);
const mockedUpdatePageBlockPage = jest.mocked(updatePageBlockPage);

function snapshot(): EditorSnapshot<"home"> {
  return {
    scope: "home",
    data: siteContentSeed.home,
    source: "published",
    draftRevision: null,
    publishedRevision: 1,
    draftUpdatedAt: null,
    publishedUpdatedAt: "2026-07-15T00:00:00.000Z"
  };
}

function repository(): jest.Mocked<ContentWorkflowRepository> {
  return {
    readPublished: jest.fn(),
    readEditor: jest.fn().mockResolvedValue(snapshot()),
    readPreview: jest.fn(),
    hasDrafts: jest.fn(),
    saveDraft: jest.fn().mockResolvedValue(snapshot()),
    publishDraft: jest.fn().mockResolvedValue(snapshot()),
    discardDraft: jest.fn().mockResolvedValue(snapshot())
  };
}

function request(path: string, method: string, body?: unknown): NextRequest {
  return new NextRequest(`http://localhost${path}`, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
}

function context(section = "home") {
  return { params: Promise.resolve({ section }) };
}

const persistenceKeys = [
  "CONTENT_RUNTIME_ENVIRONMENT",
  "CONTENT_PERSISTENCE_DRIVER",
  "CONTENT_MUTATIONS_ENABLED",
  "CONTENT_PRODUCTION_MUTATIONS_CONFIRMED",
  "CONTENT_DATABASE_RUNTIME_URL",
  "CONTENT_SITE_KEY"
] as const;

describe("admin content API mutation gate", () => {
  let repo: jest.Mocked<ContentWorkflowRepository>;
  const originalEnv = Object.fromEntries(
    persistenceKeys.map((key) => [key, process.env[key]])
  );

  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of persistenceKeys) delete process.env[key];
    process.env.CONTENT_RUNTIME_ENVIRONMENT = "preview";
    process.env.CONTENT_PERSISTENCE_DRIVER = "local";
    process.env.CONTENT_MUTATIONS_ENABLED = "true";
    repo = repository();
    mockedRejectIfNotAdmin.mockResolvedValue(null);
    mockedGetRepository.mockReturnValue(repo);
  });

  afterAll(() => {
    for (const key of persistenceKeys) {
      const value = originalEnv[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it("preserves authentication precedence while mutations are disabled", async () => {
    mockedRejectIfNotAdmin.mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );
    const response = await saveDraft(
      request("/api/admin/content/home/draft", "PUT", {
        data: siteContentSeed.home,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      }),
      context()
    );
    expect(response.status).toBe(401);
    expect(JSON.stringify(await response.json())).not.toContain("CONTENT_MUTATIONS_DISABLED");
    expect(mockedGetRepository).not.toHaveBeenCalled();
    expect(repo.saveDraft).not.toHaveBeenCalled();
  });

  it("preserves the legacy route authentication response before the gate", async () => {
    mockedRejectIfNotAdmin.mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );
    const response = await legacyPut(
      request("/api/admin/content/home", "PUT", siteContentSeed.home),
      context()
    );
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(mockedUpdateContentSection).not.toHaveBeenCalled();
  });

  it.each([
    ["Save Draft", () => saveDraft(
      request("/api/admin/content/home/draft", "PUT", {
        data: siteContentSeed.home,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      }), context()
    ), "saveDraft"],
    ["Publish", () => publishDraft(
      request("/api/admin/content/home/publish", "POST", {
        expectedDraftRevision: 1,
        expectedPublishedRevision: 1
      }), context()
    ), "publishDraft"],
    ["Discard", () => discardDraft(
      request("/api/admin/content/home/draft", "DELETE", {
        expectedDraftRevision: 1
      }), context()
    ), "discardDraft"]
  ] as const)("returns a safe 503 for authenticated %s without repository mutation", async (_label, invoke, method) => {
    const response = await invoke();
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: {
        code: "CONTENT_MUTATIONS_DISABLED",
        message: "Content mutations are temporarily unavailable."
      }
    });
    expect(mockedGetRepository).not.toHaveBeenCalled();
    expect(repo[method]).not.toHaveBeenCalled();
  });

  it("blocks legacy section and Page Block writes before their mutation helpers", async () => {
    const sectionResponse = await legacyPut(
      request("/api/admin/content/home", "PUT", siteContentSeed.home),
      context()
    );
    const pageResponse = await legacyPut(
      request("/api/admin/content/pageBlocks", "PUT", {
        page: "home",
        blocks: siteContentSeed.pageBlocks.home
      }),
      context("pageBlocks")
    );
    expect(sectionResponse.status).toBe(503);
    expect(pageResponse.status).toBe(503);
    expect(mockedUpdateContentSection).not.toHaveBeenCalled();
    expect(mockedUpdatePageBlockPage).not.toHaveBeenCalled();
  });

  it("keeps the Editor read route available while mutations are disabled", async () => {
    const response = await getEditor(
      request("/api/admin/content/home/editor", "GET"),
      context()
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, snapshot: snapshot() });
    expect(repo.readEditor).toHaveBeenCalledWith("home");
  });

  it("preserves enabled test behavior and revision responses", async () => {
    process.env.CONTENT_RUNTIME_ENVIRONMENT = "test";
    const response = await saveDraft(
      request("/api/admin/content/home/draft", "PUT", {
        data: siteContentSeed.home,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      }),
      context()
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, snapshot: snapshot() });
    expect(repo.saveDraft).toHaveBeenCalledTimes(1);
  });
});
