import {
  ContentDraftNotFoundError,
  ContentRevisionConflictError
} from "@/lib/content-workflow-errors";
import type { SiteContent } from "@/types/content";
import type {
  ContentScope,
  ContentWorkflowRepository,
  ScopeValue
} from "@/types/content-workflow";

export type ContentWorkflowRepositoryContractFixture = {
  repository: ContentWorkflowRepository;
  createPeerRepository: () => ContentWorkflowRepository;
  baselineContent: SiteContent;
  cleanup: () => Promise<void>;
};

export type ContentWorkflowRepositoryContractFixtureFactory =
  () => Promise<ContentWorkflowRepositoryContractFixture>;

const scopes = [
  "brand",
  "home",
  "founder",
  "services",
  "cases",
  "testimonials",
  "faq",
  "contact",
  "social",
  "design",
  "pageBlocks.home",
  "pageBlocks.services",
  "pageBlocks.about",
  "pageBlocks.contact"
] as const satisfies readonly ContentScope[];

function changedBrand(content: SiteContent, name: string): SiteContent["brand"] {
  return { ...content.brand, name };
}

function changedHome(content: SiteContent, title: string): SiteContent["home"] {
  return {
    ...content.home,
    hero: { ...content.home.hero, title }
  };
}

async function caught(operation: Promise<unknown>): Promise<unknown> {
  try {
    await operation;
    return undefined;
  } catch (error: unknown) {
    return error;
  }
}

export function defineContentWorkflowRepositoryContract(
  adapterName: string,
  createFixture: ContentWorkflowRepositoryContractFixtureFactory
): void {
  const contractTest = (
    name: string,
    run: (fixture: ContentWorkflowRepositoryContractFixture) => Promise<void>
  ) => {
    it(name, async () => {
      const fixture = await createFixture();
      try {
        await run(fixture);
      } finally {
        await fixture.cleanup();
      }
    });
  };

  describe(`${adapterName} ContentWorkflowRepository contract`, () => {
    contractTest("starts with revision-one Published content and no Drafts", async ({ repository, baselineContent }) => {
      const published = await repository.readPublished();
      expect(published.content).toEqual(baselineContent);
      expect(published.revision).toBe(1);
      expect(published.updatedAt).not.toBe("");
      for (const scope of scopes) {
        expect(published.scopeRevisions[scope]).toBe(1);
        expect(published.scopeUpdatedAt[scope]).not.toBe("");
      }
      await expect(repository.hasDrafts()).resolves.toBe(false);
    });

    contractTest("falls back to Published when Editor has no Draft", async ({ repository, baselineContent }) => {
      await expect(repository.readEditor("brand")).resolves.toEqual(expect.objectContaining({
        scope: "brand",
        source: "published",
        draftRevision: null,
        publishedRevision: 1,
        data: baselineContent.brand
      }));
    });

    contractTest("saves the first Draft without changing Published", async ({ repository, baselineContent }) => {
      const brand = changedBrand(baselineContent, "Contract Brand Draft");
      const saved = await repository.saveDraft({
        scope: "brand",
        value: brand,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      });

      expect(saved).toEqual(expect.objectContaining({
        source: "draft",
        draftRevision: 1,
        publishedRevision: 1,
        data: brand
      }));
      await expect(repository.hasDrafts()).resolves.toBe(true);
      expect((await repository.readPublished()).content).toEqual(baselineContent);
      expect((await repository.readEditor("brand")).data).toEqual(brand);
      const preview = await repository.readPreview("brand");
      expect(preview.brand).toEqual(brand);
      expect(preview.home).toEqual(baselineContent.home);
    });

    contractTest("increments only the Draft revision on repeated Save", async ({ repository, baselineContent }) => {
      const publishedBefore = await repository.readPublished();
      await repository.saveDraft({
        scope: "brand",
        value: changedBrand(baselineContent, "Contract Brand v1"),
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      });
      const second = await repository.saveDraft({
        scope: "brand",
        value: changedBrand(baselineContent, "Contract Brand v2"),
        expectedDraftRevision: 1,
        expectedPublishedRevision: 1
      });

      expect(second).toEqual(expect.objectContaining({
        source: "draft",
        draftRevision: 2,
        publishedRevision: 1,
        data: expect.objectContaining({ name: "Contract Brand v2" })
      }));
      expect(await repository.readPublished()).toEqual(publishedBefore);
    });

    contractTest("isolates Drafts and Preview by scope", async ({ repository, baselineContent }) => {
      const brand = changedBrand(baselineContent, "Isolated Brand");
      const home = changedHome(baselineContent, "Isolated Home");
      await repository.saveDraft({
        scope: "brand", value: brand, expectedDraftRevision: null, expectedPublishedRevision: 1
      });
      await repository.saveDraft({
        scope: "home", value: home, expectedDraftRevision: null, expectedPublishedRevision: 1
      });

      const brandPreview = await repository.readPreview("brand");
      const homePreview = await repository.readPreview("home");
      expect(brandPreview.brand).toEqual(brand);
      expect(brandPreview.home).toEqual(baselineContent.home);
      expect(homePreview.home).toEqual(home);
      expect(homePreview.brand).toEqual(baselineContent.brand);
      expect((await repository.readPublished()).content).toEqual(baselineContent);
      await expect(repository.hasDrafts()).resolves.toBe(true);
    });

    contractTest("normalizes Design and Home Page Block Drafts", async ({ repository, baselineContent }) => {
      const invalidDesign: ScopeValue<"design"> = {
        ...baselineContent.design,
        layout: { ...baselineContent.design.layout, mobileGutter: 999 as 16 }
      };
      const design = await repository.saveDraft({
        scope: "design",
        value: invalidDesign,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      });
      expect(design.data.layout.mobileGutter).toBe(baselineContent.design.layout.mobileGutter);

      const invalidBlocks: ScopeValue<"pageBlocks.home"> = [
        { ...baselineContent.pageBlocks.home[0], enabled: false, order: 99 },
        { ...baselineContent.pageBlocks.home[1], layout: "single-column" }
      ];
      const blocks = await repository.saveDraft({
        scope: "pageBlocks.home",
        value: invalidBlocks,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      });
      expect(blocks.data[0]).toEqual(expect.objectContaining({
        id: baselineContent.pageBlocks.home[0].id,
        enabled: baselineContent.pageBlocks.home[0].enabled,
        order: baselineContent.pageBlocks.home[0].order
      }));
      expect(blocks.data[1].layout).toBe(baselineContent.pageBlocks.home[1].layout);
    });

    contractTest("rejects stale Save tokens with safe metadata and preserves the Draft", async ({ repository, baselineContent }) => {
      const original = changedBrand(baselineContent, "Server Contract Value");
      await repository.saveDraft({
        scope: "brand", value: original, expectedDraftRevision: null, expectedPublishedRevision: 1
      });
      const client = changedBrand(baselineContent, "Client Contract Value");

      for (const tokens of [
        { expectedDraftRevision: null, expectedPublishedRevision: 1 },
        { expectedDraftRevision: 1, expectedPublishedRevision: 9 }
      ]) {
        const error = await caught(repository.saveDraft({ scope: "brand", value: client, ...tokens }));
        expect(error).toBeInstanceOf(ContentRevisionConflictError);
        expect(error).toEqual(expect.objectContaining({
          scope: "brand",
          currentDraftRevision: 1,
          currentPublishedRevision: 1,
          ...tokens
        }));
        if (!(error instanceof ContentRevisionConflictError)) throw error;
        const safeErrorText = [error.message, ...Object.values(error)].join(" ");
        expect(safeErrorText).not.toContain("Server Contract Value");
        expect(safeErrorText).not.toContain("Client Contract Value");
      }
      expect((await repository.readEditor("brand")).data).toEqual(original);
    });

    contractTest("publishes only the target scope and preserves other Drafts", async ({ repository, baselineContent }) => {
      const brand = changedBrand(baselineContent, "Published Contract Brand");
      const home = changedHome(baselineContent, "Remaining Home Draft");
      await repository.saveDraft({
        scope: "brand", value: brand, expectedDraftRevision: null, expectedPublishedRevision: 1
      });
      await repository.saveDraft({
        scope: "home", value: home, expectedDraftRevision: null, expectedPublishedRevision: 1
      });
      const result = await repository.publishDraft({
        scope: "brand", expectedDraftRevision: 1, expectedPublishedRevision: 1
      });

      expect(result).toEqual(expect.objectContaining({
        source: "published", draftRevision: null, publishedRevision: 2, data: brand
      }));
      const published = await repository.readPublished();
      expect(published.content.brand).toEqual(brand);
      expect(published.content.home).toEqual(baselineContent.home);
      expect(published.revision).toBe(2);
      expect(published.scopeRevisions.brand).toBe(2);
      expect(published.scopeRevisions.home).toBe(1);
      expect(await repository.readEditor("brand")).toEqual(expect.objectContaining({ source: "published" }));
      expect(await repository.readEditor("home")).toEqual(expect.objectContaining({ source: "draft", data: home }));
    });

    contractTest("rejects Publish without a Draft and preserves Published", async ({ repository }) => {
      const before = await repository.readPublished();
      await expect(repository.publishDraft({
        scope: "brand", expectedDraftRevision: 1, expectedPublishedRevision: 1
      })).rejects.toBeInstanceOf(ContentDraftNotFoundError);
      expect(await repository.readPublished()).toEqual(before);
    });

    contractTest("rejects stale Publish and preserves Published and Draft", async ({ repository, baselineContent }) => {
      const draft = changedBrand(baselineContent, "Unpublished Contract Brand");
      await repository.saveDraft({
        scope: "brand", value: draft, expectedDraftRevision: null, expectedPublishedRevision: 1
      });
      const before = await repository.readPublished();
      await expect(repository.publishDraft({
        scope: "brand", expectedDraftRevision: 2, expectedPublishedRevision: 1
      })).rejects.toBeInstanceOf(ContentRevisionConflictError);
      await expect(repository.publishDraft({
        scope: "brand", expectedDraftRevision: 1, expectedPublishedRevision: 2
      })).rejects.toBeInstanceOf(ContentRevisionConflictError);
      expect(await repository.readPublished()).toEqual(before);
      expect((await repository.readEditor("brand")).data).toEqual(draft);
    });

    contractTest("discards only the target Draft without changing Published metadata", async ({ repository, baselineContent }) => {
      const before = await repository.readPublished();
      await repository.saveDraft({
        scope: "brand", value: changedBrand(baselineContent, "Discarded Brand"),
        expectedDraftRevision: null, expectedPublishedRevision: 1
      });
      const home = changedHome(baselineContent, "Retained Home");
      await repository.saveDraft({
        scope: "home", value: home, expectedDraftRevision: null, expectedPublishedRevision: 1
      });
      const result = await repository.discardDraft({ scope: "brand", expectedDraftRevision: 1 });

      expect(result).toEqual(expect.objectContaining({ source: "published", draftRevision: null }));
      expect(await repository.readPublished()).toEqual(before);
      expect(await repository.readEditor("brand")).toEqual(expect.objectContaining({ source: "published" }));
      expect(await repository.readEditor("home")).toEqual(expect.objectContaining({ source: "draft", data: home }));
    });

    contractTest("rejects missing and stale Discard without changing safe state", async ({ repository, baselineContent }) => {
      const before = await repository.readPublished();
      await expect(repository.discardDraft({
        scope: "brand", expectedDraftRevision: 1
      })).rejects.toBeInstanceOf(ContentDraftNotFoundError);
      const draft = changedBrand(baselineContent, "Retained Contract Brand");
      await repository.saveDraft({
        scope: "brand", value: draft, expectedDraftRevision: null, expectedPublishedRevision: 1
      });
      await expect(repository.discardDraft({
        scope: "brand", expectedDraftRevision: 2
      })).rejects.toBeInstanceOf(ContentRevisionConflictError);
      expect(await repository.readPublished()).toEqual(before);
      expect((await repository.readEditor("brand")).data).toEqual(draft);
    });

    contractTest("allows exactly one concurrent same-scope Save", async ({ repository, createPeerRepository, baselineContent }) => {
      const peer = createPeerRepository();
      const results = await Promise.allSettled([
        repository.saveDraft({
          scope: "brand", value: changedBrand(baselineContent, "Concurrent Brand A"),
          expectedDraftRevision: null, expectedPublishedRevision: 1
        }),
        peer.saveDraft({
          scope: "brand", value: changedBrand(baselineContent, "Concurrent Brand B"),
          expectedDraftRevision: null, expectedPublishedRevision: 1
        })
      ]);

      expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
      const rejected = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
      expect(rejected).toHaveLength(1);
      expect(rejected[0].reason).toBeInstanceOf(ContentRevisionConflictError);
      const finalDraft = await repository.readEditor("brand");
      expect(finalDraft.source).toBe("draft");
      expect(finalDraft.draftRevision).toBe(1);
      expect(["Concurrent Brand A", "Concurrent Brand B"]).toContain(finalDraft.data.name);
    });

    contractTest("allows concurrent different-scope Saves without a false conflict", async ({ repository, createPeerRepository, baselineContent }) => {
      const peer = createPeerRepository();
      const brand = changedBrand(baselineContent, "Concurrent Scoped Brand");
      const home = changedHome(baselineContent, "Concurrent Scoped Home");
      await expect(Promise.all([
        repository.saveDraft({
          scope: "brand", value: brand, expectedDraftRevision: null, expectedPublishedRevision: 1
        }),
        peer.saveDraft({
          scope: "home", value: home, expectedDraftRevision: null, expectedPublishedRevision: 1
        })
      ])).resolves.toHaveLength(2);

      expect(await repository.readEditor("brand")).toEqual(expect.objectContaining({ source: "draft", data: brand }));
      expect(await repository.readEditor("home")).toEqual(expect.objectContaining({ source: "draft", data: home }));
      expect((await repository.readPublished()).content).toEqual(baselineContent);
    });

    contractTest("publishes concurrent different scopes without losing either update", async ({ repository, createPeerRepository, baselineContent }) => {
      const brand = changedBrand(baselineContent, "Concurrent Published Brand");
      const home = changedHome(baselineContent, "Concurrent Published Home");
      await repository.saveDraft({
        scope: "brand", value: brand, expectedDraftRevision: null, expectedPublishedRevision: 1
      });
      await repository.saveDraft({
        scope: "home", value: home, expectedDraftRevision: null, expectedPublishedRevision: 1
      });
      const peer = createPeerRepository();

      await expect(Promise.all([
        repository.publishDraft({
          scope: "brand", expectedDraftRevision: 1, expectedPublishedRevision: 1
        }),
        peer.publishDraft({
          scope: "home", expectedDraftRevision: 1, expectedPublishedRevision: 1
        })
      ])).resolves.toHaveLength(2);

      const published = await repository.readPublished();
      expect(published.content.brand).toEqual(brand);
      expect(published.content.home).toEqual(home);
      expect(published.scopeRevisions.brand).toBe(2);
      expect(published.scopeRevisions.home).toBe(2);
      expect(published.revision).toBe(3);
      await expect(repository.hasDrafts()).resolves.toBe(false);
    });
  });
}
