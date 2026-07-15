import { NextRequest, NextResponse } from "next/server";

import { GET } from "@/app/api/admin/content/[section]/editor/route";
import { siteContentSeed } from "@/data/site-content.seed";
import { rejectIfNotAdmin } from "@/lib/admin-auth";
import { contentScopes, getScopeValue } from "@/lib/content-scopes";
import { getContentWorkflowRepository } from "@/lib/content-store";
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
  source: "draft" | "published" = "published"
): EditorSnapshot<TScope> {
  return {
    scope,
    data: getScopeValue(siteContentSeed, scope),
    source,
    draftRevision: source === "draft" ? 2 : null,
    publishedRevision: 1,
    draftUpdatedAt: source === "draft" ? "2026-07-15T01:00:00.000Z" : null,
    publishedUpdatedAt: "2026-07-15T00:00:00.000Z"
  };
}

function requestFor(section: string, page?: string): NextRequest {
  const url = new URL(`http://localhost/api/admin/content/${section}/editor`);
  if (page !== undefined) url.searchParams.set("page", page);
  return new NextRequest(url);
}

function context(section: string) {
  return { params: Promise.resolve({ section }) };
}

describe("admin content workflow editor route", () => {
  let repository: jest.Mocked<ContentWorkflowRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = createRepository();
    mockedRejectIfNotAdmin.mockResolvedValue(null);
    mockedGetRepository.mockReturnValue(
      repository as unknown as ReturnType<typeof getContentWorkflowRepository>
    );
  });

  it("returns the workflow 401 envelope before reading the repository", async () => {
    mockedRejectIfNotAdmin.mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );

    const response = await GET(requestFor("home"), context("home"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: { code: "UNAUTHORIZED", message: "Admin authentication required" }
    });
    expect(mockedGetRepository).not.toHaveBeenCalled();
    expect(repository.readEditor).not.toHaveBeenCalled();
  });

  it.each([
    "brand",
    "home",
    "founder",
    "services",
    "cases",
    "testimonials",
    "faq",
    "contact",
    "social",
    "design"
  ] as const)("maps the %s section through the shared scope allowlist", async (scope) => {
    const snapshot = createSnapshot(scope);
    repository.readEditor.mockResolvedValue(snapshot);

    const response = await GET(requestFor(scope), context(scope));

    expect(response.status).toBe(200);
    expect(repository.readEditor).toHaveBeenCalledWith(scope);
    await expect(response.json()).resolves.toEqual({ ok: true, snapshot });
  });

  it.each(["home", "services", "about", "contact"] as const)(
    "maps pageBlocks.%s without accepting a client scope",
    async (page) => {
      const scope = `pageBlocks.${page}` as const;
      const snapshot = createSnapshot(scope);
      repository.readEditor.mockResolvedValue(snapshot);

      const response = await GET(requestFor("pageBlocks", page), context("pageBlocks"));

      expect(response.status).toBe(200);
      expect(repository.readEditor).toHaveBeenCalledWith(scope);
      await expect(response.json()).resolves.toEqual({ ok: true, snapshot });
    }
  );

  it("returns a Draft editor snapshot without exposing another scope", async () => {
    const snapshot = createSnapshot("home", "draft");
    repository.readEditor.mockResolvedValue(snapshot);

    const response = await GET(requestFor("home"), context("home"));

    await expect(response.json()).resolves.toEqual({ ok: true, snapshot });
    expect(repository.readEditor).toHaveBeenCalledTimes(1);
    expect(repository.readPublished).not.toHaveBeenCalled();
    expect(repository.saveDraft).not.toHaveBeenCalled();
    expect(repository.publishDraft).not.toHaveBeenCalled();
    expect(repository.discardDraft).not.toHaveBeenCalled();
  });

  it.each(["unknown", "home.title", "__proto__", "constructor", "../home"])(
    "rejects unsafe or unknown section %s",
    async (section) => {
      const response = await GET(requestFor(section), context(section));

      expect(response.status).toBe(404);
      expect(mockedGetRepository).not.toHaveBeenCalled();
      await expect(response.json()).resolves.toMatchObject({
        ok: false,
        error: { code: "NOT_FOUND" }
      });
    }
  );

  it.each([undefined, "unknown", "home.title", "__proto__", "../home"])(
    "rejects unsafe or missing Page Blocks page %s",
    async (page) => {
      const response = await GET(requestFor("pageBlocks", page), context("pageBlocks"));

      expect(response.status).toBe(404);
      expect(mockedGetRepository).not.toHaveBeenCalled();
    }
  );

  it("maps cases only to SiteContent.cases", async () => {
    const snapshot = createSnapshot("cases");
    repository.readEditor.mockResolvedValue(snapshot);

    const response = await GET(requestFor("cases"), context("cases"));

    expect(repository.readEditor).toHaveBeenCalledWith("cases");
    expect(snapshot.data).toBe(siteContentSeed.cases);
    expect(response.status).toBe(200);
  });

  it("sets private no-store headers on successful and error responses", async () => {
    repository.readEditor.mockResolvedValue(createSnapshot("home"));
    const success = await GET(requestFor("home"), context("home"));
    const failure = await GET(requestFor("unknown"), context("unknown"));

    for (const response of [success, failure]) {
      expect(response.headers.get("cache-control")).toBe("private, no-store");
      expect(response.headers.get("pragma")).toBe("no-cache");
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(response.headers.get("vary")).toBe("Cookie");
    }
  });

  it("keeps the shared scope list aligned with the route coverage", () => {
    expect(contentScopes).toHaveLength(14);
    expect(contentScopes).toContain("cases");
    expect(contentScopes).not.toContain("pageBlocks" as ContentScope);
  });
});
