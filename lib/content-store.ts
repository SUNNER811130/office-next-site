import { unstable_noStore as noStore } from "next/cache";

import { siteContentSeed } from "@/data/site-content.seed";
import { resolveContentPersistenceConfig } from "@/lib/content-persistence-config";
import { assertLegacyContentMutationsEnabled } from "@/lib/content-mutation-gate";
import {
  CONTENT_FILE,
  getContentWorkflowRepository as getRuntimeContentWorkflowRepository
} from "@/lib/content-workflow-repository-factory";
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

function assertLegacyMutationAllowed(): never {
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
  _content: SiteContent,
  _repository?: LegacyContentMutationRepository
) {
  assertLegacyMutationAllowed();
}

export async function updateContentSection<K extends ContentSection>(
  _section: K,
  _payload: ContentSectionMap[K],
  _repository?: LegacyContentMutationRepository
): Promise<SiteContent> {
  assertLegacyMutationAllowed();
}

export async function updatePageBlockPage(
  _page: "home" | "services" | "about" | "contact",
  _blocks: unknown,
  _repository?: LegacyContentMutationRepository
): Promise<SiteContent> {
  assertLegacyMutationAllowed();
}

export async function resetContentToSeed(
  repository?: LegacyContentMutationRepository
) {
  await writeContent(siteContentSeed, repository);
  return siteContentSeed;
}

export { CONTENT_FILE, siteContentSeed };
