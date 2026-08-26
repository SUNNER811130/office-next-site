import { NextRequest, NextResponse } from "next/server";

import { POST } from "@/app/api/admin/content/[section]/reset-draft/route";
import { rejectIfNotAdmin } from "@/lib/admin-auth";
import { resolveContentResetDefaults } from "@/lib/content-reset-defaults";
import { designSettingsDefaults } from "@/lib/design-settings";
import { pageBlockSettingsDefaults } from "@/lib/page-block-settings";
import { authorizeWorkflowContentMutation } from "@/lib/content-workflow-api";
import { getContentWorkflowMutationRepository } from "@/lib/content-workflow-repository-factory";
import type { EditorSnapshot } from "@/types/content-workflow";

jest.mock("@/lib/admin-auth", () => ({ rejectIfNotAdmin: jest.fn() }));
jest.mock("@/lib/content-reset-defaults", () => {
  const actual = jest.requireActual("@/lib/content-reset-defaults");
  return {
    ...actual,
    resolveContentResetDefaults: jest.fn(actual.resolveContentResetDefaults)
  };
});
jest.mock("@/lib/content-workflow-api", () => {
  const actual = jest.requireActual("@/lib/content-workflow-api");
  return {
    ...actual,
    authorizeWorkflowContentMutation: jest.fn(actual.authorizeWorkflowContentMutation)
  };
});
jest.mock("@/lib/content-workflow-repository-factory", () => ({
  getContentWorkflowMutationRepository: jest.fn()
}));

const mockedRejectIfNotAdmin = jest.mocked(rejectIfNotAdmin);
const mockedResolveContentResetDefaults = jest.mocked(resolveContentResetDefaults);
const mockedAuthorizeWorkflowContentMutation = jest.mocked(authorizeWorkflowContentMutation);
const mockedGetMutationRepository = jest.mocked(getContentWorkflowMutationRepository);

const persistenceKeys = [
  "CONTENT_RUNTIME_ENVIRONMENT",
  "CONTENT_PERSISTENCE_DRIVER",
  "CONTENT_MUTATIONS_ENABLED",
  "CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED",
  "CONTENT_MUTATIONS_RESET_DRAFT_ENABLED",
  "CONTENT_MUTATIONS_ALLOWED_SCOPES",
  "CONTENT_DATABASE_RUNTIME_URL",
  "CONTENT_SITE_KEY"
] as const;

function request(section: string, body: unknown): NextRequest {
  return new NextRequest(`http://localhost/api/admin/content/${section}/reset-draft`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body)
  });
}

function context(section: string) {
  return { params: Promise.resolve({ section }) };
}

describe("admin content workflow Reset Draft route", () => {
  const originalEnv = Object.fromEntries(
    persistenceKeys.map((key) => [key, process.env[key]])
  );
  const resetDraft = jest.fn();
  const saveDraft = jest.fn();
  const publishDraft = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedRejectIfNotAdmin.mockResolvedValue(null);
    mockedGetMutationRepository.mockReturnValue({
      resetDraft,
      saveDraft,
      publishDraft
    } as unknown as ReturnType<typeof getContentWorkflowMutationRepository>);
    process.env.CONTENT_RUNTIME_ENVIRONMENT = "preview";
    process.env.CONTENT_PERSISTENCE_DRIVER = "database";
    process.env.CONTENT_MUTATIONS_ENABLED = "true";
    process.env.CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED = "false";
    process.env.CONTENT_MUTATIONS_RESET_DRAFT_ENABLED = "true";
    process.env.CONTENT_MUTATIONS_ALLOWED_SCOPES = "design,pageBlocks.home,pageBlocks.services,pageBlocks.about,pageBlocks.contact";
    process.env.CONTENT_DATABASE_RUNTIME_URL = "postgresql://fake@localhost/db";
    process.env.CONTENT_SITE_KEY = "test";
  });

  afterAll(() => {
    for (const key of persistenceKeys) {
      const value = originalEnv[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it("returns 401 before parsing, default resolution, or mutation capability acquisition", async () => {
    mockedRejectIfNotAdmin.mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );
    const response = await POST(request("design", "not-json"), context("design"));
    expect(response.status).toBe(401);
    expect(mockedResolveContentResetDefaults).not.toHaveBeenCalled();
    expect(mockedGetMutationRepository).not.toHaveBeenCalled();
    expect(resetDraft).not.toHaveBeenCalled();
  });

  it("uses the server-owned Design default and only the saveDraft primitive", async () => {
    const snapshot: EditorSnapshot<"design"> = {
      scope: "design",
      data: designSettingsDefaults,
      source: "draft",
      draftRevision: 2,
      publishedRevision: 1,
      draftUpdatedAt: "2026-08-26T00:00:00.000Z",
      publishedUpdatedAt: "2026-08-25T00:00:00.000Z"
    };
    resetDraft.mockResolvedValue(snapshot);

    const response = await POST(request("design", {
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    }), context("design"));

    expect(response.status).toBe(200);
    expect(mockedAuthorizeWorkflowContentMutation).toHaveBeenCalledWith("reset-draft", "design");
    expect(mockedResolveContentResetDefaults).toHaveBeenCalledWith("design");
    expect(mockedAuthorizeWorkflowContentMutation.mock.invocationCallOrder[0])
      .toBeLessThan(mockedResolveContentResetDefaults.mock.invocationCallOrder[0]);
    expect(mockedResolveContentResetDefaults.mock.invocationCallOrder[0])
      .toBeLessThan(mockedGetMutationRepository.mock.invocationCallOrder[0]);
    expect(resetDraft).toHaveBeenCalledWith({
      scope: "design",
      value: designSettingsDefaults,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    expect(saveDraft).not.toHaveBeenCalled();
    expect(publishDraft).not.toHaveBeenCalled();
  });

  it.each(["home", "services", "about", "contact"] as const)(
    "uses the server-owned pageBlocks.%s default",
    async (page) => {
      resetDraft.mockResolvedValue({
        scope: `pageBlocks.${page}`,
        data: pageBlockSettingsDefaults[page],
        source: "draft",
        draftRevision: 1,
        publishedRevision: 1,
        draftUpdatedAt: "2026-08-26T00:00:00.000Z",
        publishedUpdatedAt: "2026-08-25T00:00:00.000Z"
      });
      const response = await POST(request("pageBlocks", {
        page,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      }), context("pageBlocks"));
      expect(response.status).toBe(200);
      expect(resetDraft).toHaveBeenCalledWith({
        scope: `pageBlocks.${page}`,
        value: pageBlockSettingsDefaults[page],
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      });
      expect(publishDraft).not.toHaveBeenCalled();
    }
  );

  it("rejects Client-provided reset content before authorization", async () => {
    const response = await POST(request("design", {
      data: { arbitrary: "client value" },
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    }), context("design"));
    expect(response.status).toBe(400);
    expect(mockedAuthorizeWorkflowContentMutation).not.toHaveBeenCalled();
    expect(mockedResolveContentResetDefaults).not.toHaveBeenCalled();
    expect(mockedGetMutationRepository).not.toHaveBeenCalled();
    expect(resetDraft).not.toHaveBeenCalled();
  });

  it("fails closed for a canonical but unsupported Reset scope", async () => {
    process.env.CONTENT_MUTATIONS_ALLOWED_SCOPES = "home";
    const response = await POST(request("home", {
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    }), context("home"));
    expect(response.status).toBe(404);
    expect(mockedAuthorizeWorkflowContentMutation).toHaveBeenCalledWith("reset-draft", "home");
    expect(mockedResolveContentResetDefaults).not.toHaveBeenCalled();
    expect(mockedGetMutationRepository).not.toHaveBeenCalled();
    expect(resetDraft).not.toHaveBeenCalled();
  });

  it("requires the Reset gate independently of the Save gate", async () => {
    process.env.CONTENT_MUTATIONS_RESET_DRAFT_ENABLED = "false";
    process.env.CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED = "true";
    const response = await POST(request("design", {
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    }), context("design"));
    expect(response.status).toBe(503);
    expect(mockedAuthorizeWorkflowContentMutation).toHaveBeenCalledWith("reset-draft", "design");
    expect(mockedResolveContentResetDefaults).not.toHaveBeenCalled();
    expect(mockedGetMutationRepository).not.toHaveBeenCalled();
    expect(resetDraft).not.toHaveBeenCalled();
  });
});
