import { siteContentSeed } from "@/data/site-content.seed";
import {
  applyContentMutationPolicy,
  assertLegacyContentMutationsEnabled,
  authorizeContentMutation,
  createScopedContentMutationRepositoryCapability,
  ReadOnlyContentWorkflowRepository
} from "@/lib/content-mutation-gate";
import {
  resolveContentPersistenceConfig,
  type ContentMutationOperation,
  type ContentPersistenceConfig
} from "@/lib/content-persistence-config";
import { ContentMutationDisabledError } from "@/lib/content-workflow-errors";
import type { ContentWorkflowRepository, EditorSnapshot } from "@/types/content-workflow";

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
    readPublished: jest.fn().mockResolvedValue({
      content: siteContentSeed,
      revision: 1,
      updatedAt: "2026-07-15T00:00:00.000Z",
      scopeRevisions: {} as never,
      scopeUpdatedAt: {} as never
    }),
    readEditor: jest.fn().mockResolvedValue(snapshot()),
    readPreview: jest.fn().mockResolvedValue(siteContentSeed),
    hasDrafts: jest.fn().mockResolvedValue(false),
    saveDraft: jest.fn().mockResolvedValue(snapshot()),
    publishDraft: jest.fn().mockResolvedValue(snapshot()),
    discardDraft: jest.fn().mockResolvedValue(snapshot())
  };
}

const disabledConfig: ContentPersistenceConfig = {
  environment: "preview",
  driver: "local",
  mutationsEnabled: true,
  productionMutationsConfirmed: false,
  scopedMutations: {
    valid: true,
    operations: {
      "save-draft": false,
      "discard-draft": false,
      publish: false,
      "reset-draft": false
    },
    allowedScopes: []
  },
  mutationPolicy: { enabled: false, reason: "LOCAL_DRIVER_NOT_DURABLE" },
  database: null
};

function authorizedConfig(
  operation: ContentMutationOperation,
  scope = "home"
): ContentPersistenceConfig {
  const variableName = {
    "save-draft": "CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED",
    "discard-draft": "CONTENT_MUTATIONS_DISCARD_DRAFT_ENABLED",
    publish: "CONTENT_MUTATIONS_PUBLISH_ENABLED",
    "reset-draft": "CONTENT_MUTATIONS_RESET_DRAFT_ENABLED"
  }[operation];
  return resolveContentPersistenceConfig({
    NODE_ENV: "test",
    CONTENT_RUNTIME_ENVIRONMENT: "preview",
    CONTENT_PERSISTENCE_DRIVER: "database",
    CONTENT_DATABASE_RUNTIME_URL: "postgresql://fake@localhost/db",
    CONTENT_SITE_KEY: "test",
    CONTENT_MUTATIONS_ENABLED: "true",
    CONTENT_MUTATIONS_ALLOWED_SCOPES: scope,
    [variableName]: "true"
  });
}

describe("read-only content repository", () => {
  it("delegates every read method", async () => {
    const inner = repository();
    const readOnly = applyContentMutationPolicy(inner, disabledConfig);
    await expect(readOnly.readPublished()).resolves.toMatchObject({ revision: 1 });
    await expect(readOnly.readEditor("home")).resolves.toEqual(snapshot());
    await expect(readOnly.readPreview("home")).resolves.toEqual(siteContentSeed);
    await expect(readOnly.hasDrafts()).resolves.toBe(false);
    expect(inner.readPublished).toHaveBeenCalledTimes(1);
    expect(inner.readEditor).toHaveBeenCalledWith("home");
    expect(inner.readPreview).toHaveBeenCalledWith("home");
    expect(inner.hasDrafts).toHaveBeenCalledTimes(1);
  });

  it("rejects all workflow mutations without delegating or modifying input", async () => {
    const inner = repository();
    const readOnly = new ReadOnlyContentWorkflowRepository(inner, {
      environment: "preview",
      driver: "local",
      reason: "LOCAL_DRIVER_NOT_DURABLE"
    });
    const saveInput = {
      scope: "home" as const,
      value: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    };
    const before = JSON.stringify(saveInput);
    await expect(readOnly.saveDraft(saveInput)).rejects.toBeInstanceOf(ContentMutationDisabledError);
    await expect(readOnly.publishDraft({
      scope: "home", expectedDraftRevision: 1, expectedPublishedRevision: 1
    })).rejects.toBeInstanceOf(ContentMutationDisabledError);
    await expect(readOnly.discardDraft({
      scope: "home", expectedDraftRevision: 1
    })).rejects.toBeInstanceOf(ContentMutationDisabledError);
    expect(JSON.stringify(saveInput)).toBe(before);
    expect(inner.saveDraft).not.toHaveBeenCalled();
    expect(inner.publishDraft).not.toHaveBeenCalled();
    expect(inner.discardDraft).not.toHaveBeenCalled();
  });

  it("keeps the generic repository read-only even when the master policy is enabled", async () => {
    const inner = repository();
    const generic = applyContentMutationPolicy(inner, {
      ...disabledConfig,
      environment: "test",
      mutationPolicy: { enabled: true, reason: null }
    });
    expect(generic).toBeInstanceOf(ReadOnlyContentWorkflowRepository);
    await expect(generic.saveDraft({
      scope: "home",
      value: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).rejects.toMatchObject({ reason: "SCOPED_MUTATION_CAPABILITY_REQUIRED" });
    expect(inner.saveDraft).not.toHaveBeenCalled();
  });

  it.each([
    ["save-draft", "saveDraft"],
    ["discard-draft", "discardDraft"],
    ["publish", "publishDraft"]
  ] as const)("delegates only the exact %s capability operation", async (operation, method) => {
    const inner = repository();
    const authorization = authorizeContentMutation(authorizedConfig(operation), operation, "home");
    const capability = createScopedContentMutationRepositoryCapability(inner, authorization);

    if (method === "saveDraft") {
      await capability.saveDraft({
        scope: "home",
        value: siteContentSeed.home,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      });
    } else if (method === "discardDraft") {
      await capability.discardDraft({ scope: "home", expectedDraftRevision: 1 });
    } else {
      await capability.publishDraft({
        scope: "home",
        expectedDraftRevision: 1,
        expectedPublishedRevision: 1
      });
    }
    expect(inner[method]).toHaveBeenCalledTimes(1);

    if (operation === "publish") {
      expect(() => capability.saveDraft({
        scope: "home",
        value: siteContentSeed.home,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      })).toThrow(ContentMutationDisabledError);
    } else {
      expect(() => capability.publishDraft({
        scope: "home",
        expectedDraftRevision: 1,
        expectedPublishedRevision: 1
      })).toThrow(ContentMutationDisabledError);
    }
  });

  it("rejects the wrong scope without delegating", async () => {
    const inner = repository();
    const authorization = authorizeContentMutation(
      authorizedConfig("save-draft", "home,contact"),
      "save-draft",
      "home"
    );
    const capability = createScopedContentMutationRepositoryCapability(inner, authorization);
    expect(() => capability.saveDraft({
      scope: "contact",
      value: siteContentSeed.contact,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).toThrow(expect.objectContaining({ reason: "MUTATION_SCOPE_NOT_ALLOWED" }));
    expect(inner.saveDraft).not.toHaveBeenCalled();
  });

  it("keeps Reset independent from Save while using only the saveDraft primitive", async () => {
    const inner = repository();
    const resetAuthorization = authorizeContentMutation(
      authorizedConfig("reset-draft"),
      "reset-draft",
      "home"
    );
    const resetCapability = createScopedContentMutationRepositoryCapability(
      inner,
      resetAuthorization
    );
    const input = {
      scope: "home" as const,
      value: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    };
    expect(() => resetCapability.saveDraft(input)).toThrow(
      ContentMutationDisabledError
    );
    await expect(resetCapability.resetDraft(input)).resolves.toEqual(snapshot());
    expect(inner.saveDraft).toHaveBeenCalledTimes(1);
    expect(inner.publishDraft).not.toHaveBeenCalled();

    const saveAuthorization = authorizeContentMutation(
      authorizedConfig("save-draft"),
      "save-draft",
      "home"
    );
    const saveCapability = createScopedContentMutationRepositoryCapability(
      inner,
      saveAuthorization
    );
    expect(() => saveCapability.resetDraft(input)).toThrow(
      ContentMutationDisabledError
    );
  });

  it("cannot enable a disabled policy through caller input", async () => {
    const inner = repository();
    const readOnly = applyContentMutationPolicy(inner, disabledConfig);
    await expect(readOnly.saveDraft({
      scope: "home",
      value: { ...siteContentSeed.home, mutationsEnabled: true } as typeof siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).rejects.toMatchObject({ code: "CONTENT_MUTATIONS_DISABLED" });
    expect(inner.saveDraft).not.toHaveBeenCalled();
  });

  it("rejects database-backed legacy direct mutations even under an enabled policy", () => {
    expect(() => assertLegacyContentMutationsEnabled({
      environment: "test",
      driver: "database",
      mutationsEnabled: true,
      productionMutationsConfirmed: false,
      scopedMutations: disabledConfig.scopedMutations,
      mutationPolicy: { enabled: true, reason: null },
      database: { connectionString: "postgresql://fake@localhost/db", siteKey: "test" }
    })).toThrow(expect.objectContaining({
      code: "CONTENT_MUTATIONS_DISABLED",
      reason: "LEGACY_MUTATIONS_REQUIRE_LOCAL_DRIVER"
    }));
  });

  it("does not expose the internal reason through the public workflow response", async () => {
    const { workflowErrorResponse } = await import("@/lib/content-workflow-api");
    const response = workflowErrorResponse(new ContentMutationDisabledError({
      environment: "production",
      driver: "database",
      reason: "PRODUCTION_CONFIRMATION_REQUIRED"
    }));
    const serialized = JSON.stringify(await response.json());
    expect(response.status).toBe(503);
    expect(serialized).toContain("CONTENT_MUTATIONS_DISABLED");
    expect(serialized).not.toContain("PRODUCTION_CONFIRMATION_REQUIRED");
    expect(serialized).not.toContain("production");
    expect(serialized).not.toContain("database");
  });
});
