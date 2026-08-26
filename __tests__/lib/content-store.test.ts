import { promises as fs } from "fs";
import os from "os";
import path from "path";

import { unstable_noStore as noStore } from "next/cache";

import { createEnvelopeFromLegacy } from "@/lib/content-envelope";
import {
  readContent,
  resetContentToSeed,
  siteContentSeed,
  updateContentSection,
  updatePageBlockPage,
  writeContent
} from "@/lib/content-store";
import {
  ContentMutationDisabledError
} from "@/lib/content-workflow-errors";
import { LocalFileContentWorkflowRepository } from "@/lib/content-workflow-repository";
import type { SiteContent } from "@/types/content";
import type { ContentWorkflowRepository } from "@/types/content-workflow";

jest.mock("next/cache", () => ({
  unstable_noStore: jest.fn()
}));

async function createFixture(initial?: unknown) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "office-next-store-"));
  const persistencePath = path.join(directory, "site-content.json");
  if (initial !== undefined) {
    await fs.writeFile(persistencePath, JSON.stringify(initial, null, 2), "utf8");
  }
  return {
    persistencePath,
    repository: new LocalFileContentWorkflowRepository({
      persistencePath,
      seed: siteContentSeed,
      clock: () => "2026-07-15T00:00:00.000Z"
    })
  };
}

async function withPersistenceEnv(
  values: Record<string, string | undefined>,
  operation: () => Promise<void>
) {
  const keys = Object.keys(values);
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    await operation();
  } finally {
    for (const key of keys) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

describe("Content Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockContent: SiteContent = {
    ...siteContentSeed,
    brand: { ...siteContentSeed.brand, name: "Test Brand" }
  };

  it("reads legacy content without writing", async () => {
    const { persistencePath, repository } = await createFixture(mockContent);
    const before = await fs.readFile(persistencePath, "utf8");

    const content = await readContent(repository);

    expect(noStore).toHaveBeenCalled();
    expect(content.brand.name).toBe("Test Brand");
    await expect(fs.readFile(persistencePath, "utf8")).resolves.toBe(before);
  });

  it("returns the seed in memory without creating a missing file", async () => {
    const { persistencePath, repository } = await createFixture();
    await expect(readContent(repository)).resolves.toEqual(siteContentSeed);
    await expect(fs.access(persistencePath)).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("reads only Published content from a v1 envelope", async () => {
    const envelope = createEnvelopeFromLegacy(mockContent, "2026-07-13T00:00:00.000Z");
    envelope.drafts.brand = {
      value: { ...mockContent.brand, name: "Unpublished Brand" },
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-13T01:00:00.000Z"
    };
    const { repository } = await createFixture(envelope);
    await expect(readContent(repository)).resolves.toEqual(mockContent);
  });

  it("reads through the provider-neutral workflow contract", async () => {
    const { repository } = await createFixture(mockContent);
    const workflowOnlyRepository: ContentWorkflowRepository = {
      readPublished: () => repository.readPublished(),
      readEditor: (scope) => repository.readEditor(scope),
      readPreview: (scope) => repository.readPreview(scope),
      hasDrafts: () => repository.hasDrafts(),
      saveDraft: (input) => repository.saveDraft(input),
      publishDraft: (input) => repository.publishDraft(input),
      discardDraft: (input) => repository.discardDraft(input)
    };

    expect("replaceLegacyPublished" in workflowOnlyRepository).toBe(false);
    expect("mutateLegacyPublished" in workflowOnlyRepository).toBe(false);
    expect("persistencePath" in workflowOnlyRepository).toBe(false);
    await expect(readContent(workflowOnlyRepository)).resolves.toEqual(mockContent);
  });

  it("uses design and page-block defaults for older legacy files", async () => {
    const { design: _design, pageBlocks: _pageBlocks, ...older } = mockContent;
    const { repository } = await createFixture(older);
    const content = await readContent(repository);
    expect(content.design).toEqual(siteContentSeed.design);
    expect(content.pageBlocks).toEqual(siteContentSeed.pageBlocks);
  });

  it("blocks legacy write and reset with master enabled without touching the repository", async () => {
    const fixture = await createFixture(mockContent);
    const before = await fs.readFile(fixture.persistencePath, "utf8");
    const replace = jest.spyOn(fixture.repository, "replaceLegacyPublished");

    await withPersistenceEnv({
      CONTENT_RUNTIME_ENVIRONMENT: "test",
      CONTENT_PERSISTENCE_DRIVER: "local",
      CONTENT_MUTATIONS_ENABLED: "true"
    }, async () => {
      await expect(writeContent(mockContent, fixture.repository))
        .rejects.toMatchObject({ reason: "SCOPED_MUTATION_CAPABILITY_REQUIRED" });
      await expect(resetContentToSeed(fixture.repository))
        .rejects.toMatchObject({ reason: "SCOPED_MUTATION_CAPABILITY_REQUIRED" });
    });

    expect(replace).not.toHaveBeenCalled();
    await expect(fs.readFile(fixture.persistencePath, "utf8")).resolves.toBe(before);
  });

  it("blocks legacy section mutations with master enabled without touching the repository", async () => {
    const fixture = await createFixture(mockContent);
    const before = await fs.readFile(fixture.persistencePath, "utf8");
    const mutate = jest.spyOn(fixture.repository, "mutateLegacyPublished");

    await withPersistenceEnv({
      CONTENT_RUNTIME_ENVIRONMENT: "test",
      CONTENT_PERSISTENCE_DRIVER: "local",
      CONTENT_MUTATIONS_ENABLED: "true"
    }, async () => {
      await expect(updateContentSection("brand", mockContent.brand, fixture.repository))
        .rejects.toMatchObject({ reason: "SCOPED_MUTATION_CAPABILITY_REQUIRED" });
      await expect(updateContentSection("design", mockContent.design, fixture.repository))
        .rejects.toMatchObject({ reason: "SCOPED_MUTATION_CAPABILITY_REQUIRED" });
    });

    expect(mutate).not.toHaveBeenCalled();
    await expect(fs.readFile(fixture.persistencePath, "utf8")).resolves.toBe(before);
  });

  it.each(["home", "services", "about", "contact"] as const)(
    "blocks legacy pageBlocks.%s mutation with master enabled",
    async (page) => {
      const fixture = await createFixture(mockContent);
      const before = await fs.readFile(fixture.persistencePath, "utf8");
      const mutate = jest.spyOn(fixture.repository, "mutateLegacyPublished");

      await withPersistenceEnv({
        CONTENT_RUNTIME_ENVIRONMENT: "test",
        CONTENT_PERSISTENCE_DRIVER: "local",
        CONTENT_MUTATIONS_ENABLED: "true"
      }, async () => {
        await expect(updatePageBlockPage(page, mockContent.pageBlocks[page], fixture.repository))
          .rejects.toMatchObject({ reason: "SCOPED_MUTATION_CAPABILITY_REQUIRED" });
      });

      expect(mutate).not.toHaveBeenCalled();
      await expect(fs.readFile(fixture.persistencePath, "utf8")).resolves.toBe(before);
    }
  );

  it.each(["preview", "production"] as const)(
    "blocks Local File legacy mutations in %s without touching the fixture",
    async (environment) => {
      const fixture = await createFixture(mockContent);
      const before = await fs.readFile(fixture.persistencePath, "utf8");
      await withPersistenceEnv({
        CONTENT_RUNTIME_ENVIRONMENT: environment,
        CONTENT_PERSISTENCE_DRIVER: "local",
        CONTENT_MUTATIONS_ENABLED: "true",
        CONTENT_PRODUCTION_MUTATIONS_CONFIRMED: "true"
      }, async () => {
        await expect(updateContentSection(
          "brand",
          siteContentSeed.brand,
          fixture.repository
        )).rejects.toBeInstanceOf(ContentMutationDisabledError);
      });
      await expect(fs.readFile(fixture.persistencePath, "utf8")).resolves.toBe(before);
    }
  );

  it("blocks database-driver legacy mutations before touching a Local fixture", async () => {
    const fixture = await createFixture(mockContent);
    const mutate = jest.spyOn(fixture.repository, "mutateLegacyPublished");
    await withPersistenceEnv({
      CONTENT_RUNTIME_ENVIRONMENT: "test",
      CONTENT_PERSISTENCE_DRIVER: "database",
      CONTENT_MUTATIONS_ENABLED: "true",
      CONTENT_DATABASE_RUNTIME_URL: "postgresql://runtime_user:fake@localhost:5432/office_next",
      CONTENT_SITE_KEY: "office-next"
    }, async () => {
      await expect(updateContentSection(
        "brand",
        siteContentSeed.brand,
        fixture.repository
      )).rejects.toMatchObject({ reason: "SCOPED_MUTATION_CAPABILITY_REQUIRED" });
    });
    expect(mutate).not.toHaveBeenCalled();
  });

  it("keeps readContent available while runtime mutations are disabled", async () => {
    const fixture = await createFixture(mockContent);
    await withPersistenceEnv({
      CONTENT_RUNTIME_ENVIRONMENT: "preview",
      CONTENT_PERSISTENCE_DRIVER: "local",
      CONTENT_MUTATIONS_ENABLED: "false"
    }, async () => {
      await expect(readContent(fixture.repository)).resolves.toEqual(mockContent);
    });
  });
});
