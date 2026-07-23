import { unstable_noStore as noStore } from "next/cache";

import { siteContentSeed } from "@/data/site-content.seed";
import { resolveContentPersistenceConfig } from "@/lib/content-persistence-config";
import { assertLegacyContentMutationsEnabled } from "@/lib/content-mutation-gate";
import {
  CONTENT_FILE,
  getContentWorkflowRepository as getRuntimeContentWorkflowRepository,
  getLocalFileContentWorkflowRepository
} from "@/lib/content-workflow-repository-factory";
import { normalizeDesignSettings } from "@/lib/design-settings";
import { normalizePageBlockSettings } from "@/lib/page-block-settings";
import type { ContentSection, ContentSectionMap, SiteContent } from "@/types/content";
import type { ContentWorkflowRepository } from "@/types/content-workflow";

export type ContentStoreRepository = ContentWorkflowRepository;

type LegacyContentMutationRepository = ContentWorkflowRepository & {
  replaceLegacyPublished(content: SiteContent): Promise<void>;
  mutateLegacyPublished(
    update: (latest: SiteContent) => SiteContent
  ): Promise<SiteContent>;
};

export function getContentWorkflowRepository(): ContentWorkflowRepository {
  return getRuntimeContentWorkflowRepository();
}

function getLegacyContentMutationRepository(): LegacyContentMutationRepository {
  return getLocalFileContentWorkflowRepository();
}

function assertLegacyMutationAllowed(): void {
  assertLegacyContentMutationsEnabled(resolveContentPersistenceConfig());
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
  repository?: LegacyContentMutationRepository
) {
  assertLegacyMutationAllowed();
  await (repository ?? getLegacyContentMutationRepository()).replaceLegacyPublished(content);
}

const sectionNormalizers: Partial<Record<ContentSection, (payload: unknown) => unknown>> = {
  design: normalizeDesignSettings,
  pageBlocks: normalizePageBlockSettings
};

export async function updateContentSection<K extends ContentSection>(
  section: K,
  payload: ContentSectionMap[K],
  repository?: LegacyContentMutationRepository
): Promise<SiteContent> {
  assertLegacyMutationAllowed();
  return (repository ?? getLegacyContentMutationRepository()).mutateLegacyPublished((current) => {
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
  repository?: LegacyContentMutationRepository
): Promise<SiteContent> {
  assertLegacyMutationAllowed();
  return (repository ?? getLegacyContentMutationRepository()).mutateLegacyPublished((current) => {
    const pageBlocks = normalizePageBlockSettings({
      ...current.pageBlocks,
      [page]: blocks
    });
    return { ...current, pageBlocks } satisfies SiteContent;
  });
}

export async function resetContentToSeed(
  repository?: LegacyContentMutationRepository
) {
  await writeContent(siteContentSeed, repository);
  return siteContentSeed;
}

export { CONTENT_FILE, siteContentSeed };
