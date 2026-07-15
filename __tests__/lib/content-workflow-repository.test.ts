import { promises as fs } from "fs";
import os from "os";
import path from "path";

import { atomicReplaceJson } from "@/lib/atomic-content-file";
import { createEnvelopeFromLegacy } from "@/lib/content-envelope";
import {
  ContentDraftNotFoundError,
  ContentRevisionConflictError,
  ContentStorageMutationError
} from "@/lib/content-workflow-errors";
import { LocalFileContentWorkflowRepository } from "@/lib/content-workflow-repository";
import { siteContentSeed } from "@/data/site-content.seed";
import type { ContentEnvelopeV1 } from "@/types/content-workflow";

async function createFixture(
  initial?: unknown,
  options: {
    clock?: () => string;
    atomicWriter?: (filePath: string, value: unknown) => Promise<void>;
  } = {}
) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "office-next-workflow-"));
  const persistencePath = path.join(directory, "site-content.json");
  if (initial !== undefined) {
    await fs.writeFile(persistencePath, JSON.stringify(initial, null, 2), "utf8");
  }
  return {
    directory,
    persistencePath,
    repository: new LocalFileContentWorkflowRepository({
      persistencePath,
      seed: siteContentSeed,
      clock: options.clock ?? (() => "2026-07-15T00:00:00.000Z"),
      atomicWriter: options.atomicWriter
    })
  };
}

async function readEnvelope(persistencePath: string): Promise<ContentEnvelopeV1> {
  return JSON.parse(await fs.readFile(persistencePath, "utf8")) as ContentEnvelopeV1;
}

function deferred() {
  let resolve: () => void = () => undefined;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("LocalFileContentWorkflowRepository", () => {
  it("reads Published, Editor, single-scope Preview, and Draft inspection", async () => {
    const envelope = createEnvelopeFromLegacy(siteContentSeed, "2026-07-14T00:00:00.000Z");
    envelope.drafts.brand = {
      value: { ...siteContentSeed.brand, name: "Draft Brand" },
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-15T01:00:00.000Z"
    };
    const { repository } = await createFixture(envelope);

    await expect(repository.readPublished()).resolves.toEqual(envelope.published);
    await expect(repository.readEditor("brand")).resolves.toMatchObject({
      source: "draft",
      draftRevision: 1,
      publishedRevision: 1,
      data: { name: "Draft Brand" }
    });
    const preview = await repository.readPreview("brand");
    expect(preview.brand.name).toBe("Draft Brand");
    expect(preview.home).toEqual(siteContentSeed.home);
    await expect(repository.hasDrafts()).resolves.toBe(true);

    const empty = await createFixture(siteContentSeed);
    await expect(empty.repository.hasDrafts()).resolves.toBe(false);
  });

  it("migrates Legacy and creates revision 1 only on the first successful Save Draft", async () => {
    const fixture = await createFixture(siteContentSeed);
    const before = await fs.readFile(fixture.persistencePath, "utf8");

    const snapshot = await fixture.repository.saveDraft({
      scope: "brand",
      value: { ...siteContentSeed.brand, name: "First Draft" },
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });

    expect(snapshot).toMatchObject({ source: "draft", draftRevision: 1, publishedRevision: 1 });
    const stored = await readEnvelope(fixture.persistencePath);
    expect(stored.schemaVersion).toBe(1);
    expect(stored.drafts.brand).toMatchObject({
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-15T00:00:00.000Z"
    });
    expect(stored.published.content).toEqual(siteContentSeed);
    expect(stored.published.revision).toBe(1);
    expect(await fs.readFile(fixture.persistencePath, "utf8")).not.toBe(before);
  });

  it("creates an Envelope on first successful Save Draft when persistence is missing", async () => {
    const fixture = await createFixture();
    await expect(fs.access(fixture.persistencePath)).rejects.toMatchObject({ code: "ENOENT" });
    await fixture.repository.saveDraft({
      scope: "home",
      value: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    await expect(fs.access(fixture.persistencePath)).resolves.toBeUndefined();
    expect((await readEnvelope(fixture.persistencePath)).drafts.home?.revision).toBe(1);
  });

  it("preserves exact Legacy bytes when the first mutation write fails", async () => {
    const fixture = await createFixture(siteContentSeed, {
      atomicWriter: async () => {
        throw new Error("injected failure");
      }
    });
    const before = await fs.readFile(fixture.persistencePath, "utf8");

    await expect(fixture.repository.saveDraft({
      scope: "brand",
      value: siteContentSeed.brand,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).rejects.toBeInstanceOf(ContentStorageMutationError);
    await expect(fs.readFile(fixture.persistencePath, "utf8")).resolves.toBe(before);
  });

  it.each([
    { schemaVersion: 99, published: {}, drafts: {} },
    { schemaVersion: 1, published: {}, drafts: {} }
  ])("does not overwrite unknown or malformed envelopes", async (invalid) => {
    const fixture = await createFixture(invalid);
    const before = await fs.readFile(fixture.persistencePath, "utf8");
    await expect(fixture.repository.saveDraft({
      scope: "brand",
      value: siteContentSeed.brand,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).rejects.toThrow();
    await expect(fs.readFile(fixture.persistencePath, "utf8")).resolves.toBe(before);
  });

  it("increments only Draft revision on repeated Save Draft", async () => {
    const baseline = createEnvelopeFromLegacy(siteContentSeed, "2026-07-14T00:00:00.000Z");
    const fixture = await createFixture(baseline, {
      clock: (() => {
        const values = ["2026-07-15T01:00:00.000Z", "2026-07-15T02:00:00.000Z"];
        return () => values.shift() ?? "2026-07-15T02:00:00.000Z";
      })()
    });
    const publishedBefore = await fixture.repository.readPublished();
    const first = await fixture.repository.saveDraft({
      scope: "brand",
      value: { ...siteContentSeed.brand, name: "v1" },
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    const second = await fixture.repository.saveDraft({
      scope: "brand",
      value: { ...siteContentSeed.brand, name: "v2" },
      expectedDraftRevision: first.draftRevision,
      expectedPublishedRevision: 1
    });

    expect(second).toMatchObject({ draftRevision: 2, publishedRevision: 1, source: "draft" });
    expect(second.data.name).toBe("v2");
    expect(await fixture.repository.readPublished()).toEqual(publishedBefore);
  });

  it.each([
    { expectedDraftRevision: null, expectedPublishedRevision: 1 },
    { expectedDraftRevision: 9, expectedPublishedRevision: 1 },
    { expectedDraftRevision: 1, expectedPublishedRevision: 9 }
  ])("returns safe typed conflict metadata for stale Save Draft tokens", async (tokens) => {
    const envelope = createEnvelopeFromLegacy(siteContentSeed, "2026-07-14T00:00:00.000Z");
    envelope.drafts.brand = {
      value: { ...siteContentSeed.brand, name: "Server-only value" },
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-14T01:00:00.000Z"
    };
    const { repository } = await createFixture(envelope);
    const error = await repository.saveDraft({
      scope: "brand",
      value: { ...siteContentSeed.brand, name: "Client-only value" },
      ...tokens
    }).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ContentRevisionConflictError);
    expect(error).toMatchObject({
      scope: "brand",
      currentDraftRevision: 1,
      currentPublishedRevision: 1,
      ...tokens
    });
    expect(JSON.stringify(error)).not.toContain("Server-only value");
    expect(JSON.stringify(error)).not.toContain("Client-only value");
  });

  it("rejects a later Save when the Draft base no longer matches Published", async () => {
    const envelope = createEnvelopeFromLegacy(siteContentSeed, "2026-07-14T00:00:00.000Z");
    envelope.published.scopeRevisions.brand = 2;
    envelope.drafts.brand = {
      value: siteContentSeed.brand,
      revision: 3,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-14T01:00:00.000Z"
    };
    const { repository } = await createFixture(envelope);
    await expect(repository.saveDraft({
      scope: "brand",
      value: siteContentSeed.brand,
      expectedDraftRevision: 3,
      expectedPublishedRevision: 2
    })).rejects.toBeInstanceOf(ContentRevisionConflictError);
  });

  it("normalizes Design and Page Block Draft values", async () => {
    const designFixture = await createFixture(siteContentSeed);
    const design = await designFixture.repository.saveDraft({
      scope: "design",
      value: {
        ...siteContentSeed.design,
        layout: { ...siteContentSeed.design.layout, mobileGutter: 999 as 16 }
      },
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    expect(design.data.layout.mobileGutter).toBe(siteContentSeed.design.layout.mobileGutter);

    const blocksFixture = await createFixture(siteContentSeed);
    const blocks = await blocksFixture.repository.saveDraft({
      scope: "pageBlocks.home",
      value: [
        { ...siteContentSeed.pageBlocks.home[0], enabled: false, order: 99 },
        { ...siteContentSeed.pageBlocks.home[1], layout: "single-column" }
      ],
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    expect(blocks.data[0]).toEqual(expect.objectContaining({ id: "hero", enabled: true, order: 0 }));
    expect(blocks.data.find((block) => block.id === "work-upgrade")?.layout).toBe("default");
  });

  it("publishes only the target scope, advances its revisions/timestamps, and preserves other Drafts", async () => {
    const envelope = createEnvelopeFromLegacy(siteContentSeed, "2026-07-14T00:00:00.000Z");
    envelope.drafts.brand = {
      value: { ...siteContentSeed.brand, name: "Published Brand" },
      revision: 2,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-14T01:00:00.000Z"
    };
    envelope.drafts.home = {
      value: { ...siteContentSeed.home, hero: { ...siteContentSeed.home.hero, title: "Other Draft" } },
      revision: 4,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-14T02:00:00.000Z"
    };
    const { repository, persistencePath } = await createFixture(envelope, {
      clock: () => "2026-07-15T03:00:00.000Z"
    });

    const result = await repository.publishDraft({
      scope: "brand",
      expectedDraftRevision: 2,
      expectedPublishedRevision: 1
    });
    const stored = await readEnvelope(persistencePath);

    expect(result).toMatchObject({ source: "published", draftRevision: null, publishedRevision: 2 });
    expect(stored.published.content.brand.name).toBe("Published Brand");
    expect(stored.published.content.home).toEqual(siteContentSeed.home);
    expect(stored.published.revision).toBe(2);
    expect(stored.published.scopeRevisions.brand).toBe(2);
    expect(stored.published.scopeRevisions.home).toBe(1);
    expect(stored.published.updatedAt).toBe("2026-07-15T03:00:00.000Z");
    expect(stored.published.scopeUpdatedAt.brand).toBe("2026-07-15T03:00:00.000Z");
    expect(stored.published.scopeUpdatedAt.home).toBe("2026-07-14T00:00:00.000Z");
    expect(stored.drafts.brand).toBeUndefined();
    expect(stored.drafts.home?.revision).toBe(4);
  });

  it("publishes pageBlocks.home without changing services, about, or contact", async () => {
    const envelope = createEnvelopeFromLegacy(siteContentSeed, "2026-07-14T00:00:00.000Z");
    const homeDraft = siteContentSeed.pageBlocks.home.map((block) => (
      block.id === "faq" ? { ...block, enabled: false } : block
    ));
    envelope.drafts["pageBlocks.home"] = {
      value: homeDraft,
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-14T01:00:00.000Z"
    };
    const { repository } = await createFixture(envelope);
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
  });

  it.each([
    { expectedDraftRevision: 7, expectedPublishedRevision: 1 },
    { expectedDraftRevision: 1, expectedPublishedRevision: 7 }
  ])("rejects Publish with stale revisions", async (tokens) => {
    const envelope = createEnvelopeFromLegacy(siteContentSeed, "2026-07-14T00:00:00.000Z");
    envelope.drafts.brand = {
      value: siteContentSeed.brand,
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-14T01:00:00.000Z"
    };
    const { repository } = await createFixture(envelope);
    await expect(repository.publishDraft({ scope: "brand", ...tokens })).rejects.toBeInstanceOf(ContentRevisionConflictError);
  });

  it("rejects Publish when the Draft base no longer matches Published", async () => {
    const envelope = createEnvelopeFromLegacy(siteContentSeed, "2026-07-14T00:00:00.000Z");
    envelope.published.scopeRevisions.brand = 2;
    envelope.drafts.brand = {
      value: siteContentSeed.brand,
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-14T01:00:00.000Z"
    };
    const { repository } = await createFixture(envelope);
    await expect(repository.publishDraft({
      scope: "brand",
      expectedDraftRevision: 1,
      expectedPublishedRevision: 2
    })).rejects.toBeInstanceOf(ContentRevisionConflictError);
  });

  it("preserves the complete Published Envelope when Publish persistence fails", async () => {
    const envelope = createEnvelopeFromLegacy(siteContentSeed, "2026-07-14T00:00:00.000Z");
    envelope.drafts.brand = {
      value: { ...siteContentSeed.brand, name: "Must Not Publish" },
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-14T01:00:00.000Z"
    };
    const fixture = await createFixture(envelope, {
      atomicWriter: async () => {
        throw new Error("publish write failed");
      }
    });
    const before = await fs.readFile(fixture.persistencePath, "utf8");
    await expect(fixture.repository.publishDraft({
      scope: "brand",
      expectedDraftRevision: 1,
      expectedPublishedRevision: 1
    })).rejects.toBeInstanceOf(ContentStorageMutationError);
    await expect(fs.readFile(fixture.persistencePath, "utf8")).resolves.toBe(before);
  });

  it("returns DraftNotFound without creating or migrating a Legacy file", async () => {
    const fixture = await createFixture(siteContentSeed);
    const before = await fs.readFile(fixture.persistencePath, "utf8");
    await expect(fixture.repository.publishDraft({
      scope: "brand",
      expectedDraftRevision: 1,
      expectedPublishedRevision: 1
    })).rejects.toBeInstanceOf(ContentDraftNotFoundError);
    await expect(fixture.repository.discardDraft({
      scope: "brand",
      expectedDraftRevision: 1
    })).rejects.toBeInstanceOf(ContentDraftNotFoundError);
    await expect(fs.readFile(fixture.persistencePath, "utf8")).resolves.toBe(before);
  });

  it("discards only the target Draft without changing Published metadata", async () => {
    const envelope = createEnvelopeFromLegacy(siteContentSeed, "2026-07-14T00:00:00.000Z");
    envelope.drafts.brand = {
      value: siteContentSeed.brand,
      revision: 2,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-14T01:00:00.000Z"
    };
    envelope.drafts.home = {
      value: siteContentSeed.home,
      revision: 3,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-14T02:00:00.000Z"
    };
    const { repository, persistencePath } = await createFixture(envelope);
    await repository.discardDraft({ scope: "brand", expectedDraftRevision: 2 });
    const stored = await readEnvelope(persistencePath);
    expect(stored.published).toEqual(envelope.published);
    expect(stored.drafts.brand).toBeUndefined();
    expect(stored.drafts.home).toEqual(envelope.drafts.home);
  });

  it("rejects Discard with a stale Draft revision", async () => {
    const envelope = createEnvelopeFromLegacy(siteContentSeed, "2026-07-14T00:00:00.000Z");
    envelope.drafts.brand = {
      value: siteContentSeed.brand,
      revision: 2,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-14T01:00:00.000Z"
    };
    const { repository } = await createFixture(envelope);
    await expect(repository.discardDraft({
      scope: "brand",
      expectedDraftRevision: 1
    })).rejects.toBeInstanceOf(ContentRevisionConflictError);
  });

  it("shares one coordinator across Repository instances and avoids false cross-scope conflict", async () => {
    const fixture = await createFixture(siteContentSeed);
    const entered = deferred();
    const release = deferred();
    let writerCalls = 0;
    let activeWriters = 0;
    let maximumActiveWriters = 0;
    const writer = async (filePath: string, value: unknown) => {
      writerCalls += 1;
      activeWriters += 1;
      maximumActiveWriters = Math.max(maximumActiveWriters, activeWriters);
      if (writerCalls === 1) {
        entered.resolve();
        await release.promise;
      }
      await atomicReplaceJson(filePath, value);
      activeWriters -= 1;
    };
    const firstRepository = new LocalFileContentWorkflowRepository({
      persistencePath: fixture.persistencePath,
      seed: siteContentSeed,
      atomicWriter: writer
    });
    const secondRepository = new LocalFileContentWorkflowRepository({
      persistencePath: fixture.persistencePath,
      seed: siteContentSeed,
      atomicWriter: writer
    });

    const first = firstRepository.saveDraft({
      scope: "brand",
      value: siteContentSeed.brand,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    await entered.promise;
    const second = secondRepository.saveDraft({
      scope: "home",
      value: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    await Promise.resolve();
    expect(writerCalls).toBe(1);
    release.resolve();
    await Promise.all([first, second]);

    expect(maximumActiveWriters).toBe(1);
    const stored = await readEnvelope(fixture.persistencePath);
    expect(stored.drafts.brand?.revision).toBe(1);
    expect(stored.drafts.home?.revision).toBe(1);
  });

  it("allows a later Repository mutation after an earlier writer rejects", async () => {
    const fixture = await createFixture(siteContentSeed);
    const failing = new LocalFileContentWorkflowRepository({
      persistencePath: fixture.persistencePath,
      seed: siteContentSeed,
      atomicWriter: async () => {
        throw new Error("first failure");
      }
    });
    const succeeding = new LocalFileContentWorkflowRepository({
      persistencePath: fixture.persistencePath,
      seed: siteContentSeed
    });

    await expect(failing.saveDraft({
      scope: "brand",
      value: siteContentSeed.brand,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).rejects.toBeInstanceOf(ContentStorageMutationError);
    await expect(succeeding.saveDraft({
      scope: "home",
      value: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).resolves.toMatchObject({ draftRevision: 1 });
  });

  it("serializes legacy latest-read/merge/write across Repository instances", async () => {
    const fixture = await createFixture(siteContentSeed);
    const entered = deferred();
    const release = deferred();
    let calls = 0;
    const writer = async (filePath: string, value: unknown) => {
      calls += 1;
      if (calls === 1) {
        entered.resolve();
        await release.promise;
      }
      await atomicReplaceJson(filePath, value);
    };
    const first = new LocalFileContentWorkflowRepository({
      persistencePath: fixture.persistencePath,
      seed: siteContentSeed,
      atomicWriter: writer
    });
    const second = new LocalFileContentWorkflowRepository({
      persistencePath: fixture.persistencePath,
      seed: siteContentSeed,
      atomicWriter: writer
    });

    const brandMutation = first.mutateLegacyPublished((latest) => ({
      ...latest,
      brand: { ...latest.brand, name: "Concurrent Brand" }
    }));
    await entered.promise;
    const homeMutation = second.mutateLegacyPublished((latest) => ({
      ...latest,
      home: { ...latest.home, hero: { ...latest.home.hero, title: "Concurrent Home" } }
    }));
    await Promise.resolve();
    expect(calls).toBe(1);
    release.resolve();
    await Promise.all([brandMutation, homeMutation]);

    const stored = JSON.parse(await fs.readFile(fixture.persistencePath, "utf8")) as typeof siteContentSeed;
    expect(stored.brand.name).toBe("Concurrent Brand");
    expect(stored.home.hero.title).toBe("Concurrent Home");
  });
});
