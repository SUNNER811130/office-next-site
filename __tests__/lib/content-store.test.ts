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
import { LegacyContentWriteBlockedError } from "@/lib/content-workflow-errors";
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

  it("normalizes Design and Page Blocks legacy updates", async () => {
    const first = await createFixture(mockContent);
    const design = await updateContentSection("design", {
      ...siteContentSeed.design,
      layout: { ...siteContentSeed.design.layout, mobileGutter: 999 as 16 }
    }, first.repository);
    expect(design.design.layout.mobileGutter).toBe(siteContentSeed.design.layout.mobileGutter);

    const second = await createFixture(mockContent);
    const blocks = await updateContentSection("pageBlocks", {
      ...siteContentSeed.pageBlocks,
      home: [{ ...siteContentSeed.pageBlocks.home[0], enabled: false, order: 99 }]
    }, second.repository);
    expect(blocks.pageBlocks.home[0]).toEqual(expect.objectContaining({
      id: "hero",
      enabled: true,
      order: 0
    }));
  });

  it.each(["home", "services", "about", "contact"] as const)(
    "updates only the %s Page Blocks page from the latest legacy file",
    async (page) => {
      const changedHome = mockContent.pageBlocks.home.map((block) => (
        block.id === "faq" ? { ...block, enabled: false } : block
      ));
      const latest = {
        ...mockContent,
        pageBlocks: { ...mockContent.pageBlocks, home: changedHome }
      };
      const { repository } = await createFixture(latest);
      const next = await updatePageBlockPage(page, siteContentSeed.pageBlocks[page], repository);

      if (page !== "home") {
        expect(next.pageBlocks.home.find((block) => block.id === "faq")?.enabled).toBe(false);
      }
      for (const other of ["home", "services", "about", "contact"] as const) {
        if (other !== page && other !== "home") {
          expect(next.pageBlocks[other]).toEqual(latest.pageBlocks[other]);
        }
      }
    }
  );

  it("writes and resets legacy content through atomic persistence", async () => {
    const fixture = await createFixture(mockContent);
    await writeContent({ ...mockContent, brand: { ...mockContent.brand, name: "Replacement" } }, fixture.repository);
    await expect(readContent(fixture.repository)).resolves.toMatchObject({ brand: { name: "Replacement" } });

    await resetContentToSeed(fixture.repository);
    await expect(readContent(fixture.repository)).resolves.toEqual(siteContentSeed);
    const raw = await fs.readFile(fixture.persistencePath, "utf8");
    expect(raw.endsWith("\n")).toBe(true);
  });

  it("blocks all legacy write boundaries after Envelope migration", async () => {
    const envelope = createEnvelopeFromLegacy(mockContent, "2026-07-15T00:00:00.000Z");
    envelope.drafts.brand = {
      value: { ...mockContent.brand, name: "Draft" },
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-15T01:00:00.000Z"
    };
    const fixture = await createFixture(envelope);
    const before = await fs.readFile(fixture.persistencePath, "utf8");

    await expect(writeContent(mockContent, fixture.repository)).rejects.toBeInstanceOf(LegacyContentWriteBlockedError);
    await expect(updateContentSection("brand", mockContent.brand, fixture.repository)).rejects.toBeInstanceOf(LegacyContentWriteBlockedError);
    await expect(updatePageBlockPage("home", mockContent.pageBlocks.home, fixture.repository)).rejects.toBeInstanceOf(LegacyContentWriteBlockedError);
    await expect(fs.readFile(fixture.persistencePath, "utf8")).resolves.toBe(before);
  });
});
