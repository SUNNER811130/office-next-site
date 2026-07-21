import path from "path";

import { unstable_noStore as noStore } from "next/cache";

import { siteContentSeed } from "@/data/site-content.seed";
import { LocalFileContentWorkflowRepository } from "@/lib/content-workflow-repository";
import { normalizeDesignSettings } from "@/lib/design-settings";
import { normalizePageBlockSettings } from "@/lib/page-block-settings";
import type { ContentSection, ContentSectionMap, SiteContent } from "@/types/content";
import type { ContentWorkflowRepository } from "@/types/content-workflow";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");

export type ContentStoreRepository = ContentWorkflowRepository;

type LegacyContentMutationRepository = ContentWorkflowRepository & {
  replaceLegacyPublished(content: SiteContent): Promise<void>;
  mutateLegacyPublished(
    update: (latest: SiteContent) => SiteContent
  ): Promise<SiteContent>;
};

function createLocalFileRepository(): LocalFileContentWorkflowRepository {
  return new LocalFileContentWorkflowRepository({
    persistencePath: CONTENT_FILE,
    seed: siteContentSeed
  });
}

export function getContentWorkflowRepository(): ContentWorkflowRepository {
  return createLocalFileRepository();
}

function getLegacyContentMutationRepository(): LegacyContentMutationRepository {
  return createLocalFileRepository();
}

export async function readContent(
  repository: ContentWorkflowRepository = getContentWorkflowRepository()
): Promise<SiteContent> {
  noStore();
  return (await repository.readPublished()).content;
}

/** @deprecated Restricted to legacy persistence before workflow migration. */
export async function writeContent(
  content: SiteContent,
  repository: LegacyContentMutationRepository = getLegacyContentMutationRepository()
) {
  await repository.replaceLegacyPublished(content);
}

const sectionNormalizers: Partial<Record<ContentSection, (payload: unknown) => unknown>> = {
  design: normalizeDesignSettings,
  pageBlocks: normalizePageBlockSettings
};

export async function updateContentSection<K extends ContentSection>(
  section: K,
  payload: ContentSectionMap[K],
  repository: LegacyContentMutationRepository = getLegacyContentMutationRepository()
): Promise<SiteContent> {
  return repository.mutateLegacyPublished((current) => {
    const normalizedPayload = (sectionNormalizers[section]?.(payload) ?? payload) as ContentSectionMap[K];
    return {
      ...current,
      [section]: normalizedPayload
    } satisfies SiteContent;
  });
}

export async function updatePageBlockPage(
  page: "home" | "services" | "about" | "contact",
  blocks: unknown,
  repository: LegacyContentMutationRepository = getLegacyContentMutationRepository()
): Promise<SiteContent> {
  return repository.mutateLegacyPublished((current) => {
    const pageBlocks = normalizePageBlockSettings({
      ...current.pageBlocks,
      [page]: blocks
    });
    return { ...current, pageBlocks } satisfies SiteContent;
  });
}

export async function resetContentToSeed(
  repository: LegacyContentMutationRepository = getLegacyContentMutationRepository()
) {
  await writeContent(siteContentSeed, repository);
  return siteContentSeed;
}

export { CONTENT_FILE, siteContentSeed };
