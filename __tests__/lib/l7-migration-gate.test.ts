import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { readAdminPreview } from "@/lib/admin-preview";
import { isContentScope } from "@/lib/content-scopes";
import {
  ContentDraftNotFoundError,
  ContentRevisionConflictError,
  ContentStorageMutationError
} from "@/lib/content-workflow-errors";
import { LocalFileContentWorkflowRepository } from "@/lib/content-workflow-repository";
import type { SiteContent } from "@/types/content";
import type { ContentEnvelopeV1 } from "@/types/content-workflow";

const gateDirectory = process.env.L7_MIGRATION_DIR;

if (!gateDirectory || !gateDirectory.startsWith("/tmp/office-next-l7-migration-")) {
  throw new Error("L7_MIGRATION_DIR must be a dedicated /tmp migration gate directory");
}

const baselinePath = path.join(process.cwd(), "data/site-content.json");
let baselineBytes = "";
let baseline: SiteContent;

const evidence: Record<string, unknown> = {
  failureSafety: {}
};

function sha(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function createLegacyFixture(name: string) {
  const directory = path.join(gateDirectory!, name);
  await fs.mkdir(directory, { recursive: true });
  const persistencePath = path.join(directory, "site-content.json");
  await fs.writeFile(persistencePath, baselineBytes, "utf8");
  return {
    directory,
    persistencePath,
    repository: new LocalFileContentWorkflowRepository({
      persistencePath,
      seed: baseline,
      clock: () => "2026-07-17T06:00:00.000Z"
    })
  };
}

async function readEnvelope(persistencePath: string): Promise<ContentEnvelopeV1> {
  return JSON.parse(await fs.readFile(persistencePath, "utf8")) as ContentEnvelopeV1;
}

async function countAtomicTemps(directory: string): Promise<number> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) count += await countAtomicTemps(entryPath);
    if (entry.isFile() && entry.name.includes(".tmp-")) count += 1;
  }
  return count;
}

beforeAll(async () => {
  baselineBytes = await fs.readFile(baselinePath, "utf8");
  baseline = JSON.parse(baselineBytes) as SiteContent;
  await fs.mkdir(gateDirectory, { recursive: true });
  evidence.baselineSha256 = sha(baselineBytes);
});

afterAll(async () => {
  evidence.atomicTempFiles = await countAtomicTemps(gateDirectory);
  await fs.writeFile(
    path.join(gateDirectory, "gate-evidence.json"),
    `${JSON.stringify(evidence, null, 2)}\n`,
    "utf8"
  );
});

describe("L7 formal Legacy migration gate", () => {
  it("keeps formal Legacy bytes unchanged for read-only Editor and Preview, then safely migrates and discards", async () => {
    const fixture = await createLegacyFixture("read-save-discard");
    const backupPath = path.join(fixture.directory, "site-content.legacy.backup.json");
    await fs.writeFile(backupPath, baselineBytes, "utf8");

    await expect(fixture.repository.readPublished()).resolves.toMatchObject({ revision: 1 });
    await expect(fixture.repository.readEditor("brand")).resolves.toMatchObject({
      source: "published",
      draftRevision: null,
      publishedRevision: 1
    });
    await expect(readAdminPreview("home", fixture.repository)).resolves.toMatchObject({
      source: "published",
      draftScopes: []
    });
    expect(await fs.readFile(fixture.persistencePath, "utf8")).toBe(baselineBytes);

    const saved = await fixture.repository.saveDraft({
      scope: "brand",
      value: { ...baseline.brand, name: "L7 isolated migration draft" },
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    const migratedBytes = await fs.readFile(fixture.persistencePath, "utf8");
    const migrated = JSON.parse(migratedBytes) as ContentEnvelopeV1;
    expect(migrated.schemaVersion).toBe(1);
    expect(migrated.published.content).toEqual(baseline);
    expect(migrated.published.revision).toBe(1);
    expect(Object.keys(migrated.drafts)).toEqual(["brand"]);
    expect(saved).toMatchObject({ source: "draft", draftRevision: 1, publishedRevision: 1 });

    await fixture.repository.discardDraft({ scope: "brand", expectedDraftRevision: 1 });
    const discarded = await readEnvelope(fixture.persistencePath);
    expect(discarded.schemaVersion).toBe(1);
    expect(discarded.drafts).toEqual({});
    expect(discarded.published.content).toEqual(baseline);

    evidence.readOnlyShaUnchanged = true;
    evidence.backupSha256 = sha(await fs.readFile(backupPath, "utf8"));
    evidence.firstMigrationSha256 = sha(migratedBytes);
    evidence.firstDraftScope = "brand";
    evidence.firstDraftRevision = saved.draftRevision;
    evidence.firstPublishedRevision = saved.publishedRevision;
    evidence.discardPublishedEqualsBaseline = true;
  });

  it("publishes only one scope and normalizes the first Page Block Draft without changing Published", async () => {
    const publishFixture = await createLegacyFixture("save-publish");
    const saved = await publishFixture.repository.saveDraft({
      scope: "brand",
      value: { ...baseline.brand, name: "L7 isolated published draft" },
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    const published = await publishFixture.repository.publishDraft({
      scope: "brand",
      expectedDraftRevision: saved.draftRevision!,
      expectedPublishedRevision: saved.publishedRevision
    });
    const publishedEnvelope = await readEnvelope(publishFixture.persistencePath);
    expect(published).toMatchObject({ source: "published", draftRevision: null, publishedRevision: 2 });
    expect(publishedEnvelope.drafts).toEqual({});
    expect(publishedEnvelope.published.revision).toBe(2);
    expect(publishedEnvelope.published.scopeRevisions.brand).toBe(2);
    expect(publishedEnvelope.published.content.brand).not.toEqual(baseline.brand);
    expect({ ...publishedEnvelope.published.content, brand: baseline.brand }).toEqual(baseline);

    const blocksFixture = await createLegacyFixture("page-block-first-write");
    const candidate = baseline.pageBlocks.home.map((block) => (
      block.id === "hero"
        ? { ...block, enabled: false, order: 99 }
        : block.id === "faq" ? { ...block, enabled: false } : block
    ));
    const blocks = await blocksFixture.repository.saveDraft({
      scope: "pageBlocks.home",
      value: candidate,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    const blockEnvelope = await readEnvelope(blocksFixture.persistencePath);
    expect(blockEnvelope.schemaVersion).toBe(1);
    expect(blockEnvelope.published.content).toEqual(baseline);
    expect(blocks.data.map((block) => block.id)).toEqual(baseline.pageBlocks.home.map((block) => block.id));
    expect(blocks.data[0]).toMatchObject({ id: "hero", enabled: true, order: 0 });
    await blocksFixture.repository.discardDraft({
      scope: "pageBlocks.home",
      expectedDraftRevision: blocks.draftRevision!
    });
    expect((await readEnvelope(blocksFixture.persistencePath)).published.content).toEqual(baseline);

    evidence.publishGlobalRevision = publishedEnvelope.published.revision;
    evidence.publishScopeRevision = publishedEnvelope.published.scopeRevisions.brand;
    evidence.publishOtherScopesUnchanged = true;
    evidence.pageBlockNormalizerPassed = true;
    evidence.pageBlockPublishedEqualsBaselineAfterDiscard = true;
  });

  it("preserves files across failed, stale, missing, malformed, invalid, and concurrent operations", async () => {
    const failed = await createLegacyFixture("failed-first-write");
    const failingRepository = new LocalFileContentWorkflowRepository({
      persistencePath: failed.persistencePath,
      seed: baseline,
      atomicWriter: async () => {
        throw new Error("injected L7 write failure");
      }
    });
    await expect(failingRepository.saveDraft({
      scope: "brand",
      value: baseline.brand,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).rejects.toBeInstanceOf(ContentStorageMutationError);
    expect(await fs.readFile(failed.persistencePath, "utf8")).toBe(baselineBytes);

    const missing = await createLegacyFixture("missing-draft");
    await expect(missing.repository.publishDraft({
      scope: "brand",
      expectedDraftRevision: 1,
      expectedPublishedRevision: 1
    })).rejects.toBeInstanceOf(ContentDraftNotFoundError);
    expect(await fs.readFile(missing.persistencePath, "utf8")).toBe(baselineBytes);

    const malformed = await createLegacyFixture("malformed");
    const malformedBytes = "{\"schemaVersion\":1,\"published\":{}\n";
    await fs.writeFile(malformed.persistencePath, malformedBytes, "utf8");
    await expect(malformed.repository.saveDraft({
      scope: "brand",
      value: baseline.brand,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).rejects.toBeInstanceOf(ContentStorageMutationError);
    expect(await fs.readFile(malformed.persistencePath, "utf8")).toBe(malformedBytes);
    expect(isContentScope("invalid.scope")).toBe(false);

    const concurrent = await createLegacyFixture("concurrent");
    const secondRepository = new LocalFileContentWorkflowRepository({
      persistencePath: concurrent.persistencePath,
      seed: baseline
    });
    await Promise.all([
      concurrent.repository.saveDraft({
        scope: "brand",
        value: baseline.brand,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      }),
      secondRepository.saveDraft({
        scope: "home",
        value: baseline.home,
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      })
    ]);
    const concurrentEnvelope = await readEnvelope(concurrent.persistencePath);
    expect(Object.keys(concurrentEnvelope.drafts).sort()).toEqual(["brand", "home"]);
    const beforeConflict = await fs.readFile(concurrent.persistencePath, "utf8");
    await expect(concurrent.repository.saveDraft({
      scope: "brand",
      value: baseline.brand,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).rejects.toBeInstanceOf(ContentRevisionConflictError);
    expect(await fs.readFile(concurrent.persistencePath, "utf8")).toBe(beforeConflict);

    evidence.failureSafety = {
      failedFirstWritePreservedLegacy: true,
      missingDraftPreservedLegacy: true,
      malformedFilePreserved: true,
      invalidScopeRejected: true,
      staleRevisionPreservedEnvelope: true,
      concurrentWritesSerializedWithoutLoss: true
    };
  });
});
