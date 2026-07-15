import path from "path";

import { unstable_noStore as noStore } from "next/cache";

import { siteContentSeed } from "@/data/site-content.seed";
import { LocalFileContentWorkflowRepository } from "@/lib/content-workflow-repository";
import { normalizeDesignSettings } from "@/lib/design-settings";
import { normalizePageBlockSettings } from "@/lib/page-block-settings";
import type { ContentSection, ContentSectionMap, SiteContent } from "@/types/content";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");

export type ContentStoreRepository = LocalFileContentWorkflowRepository;

export function getContentWorkflowRepository(): ContentStoreRepository {
  return new LocalFileContentWorkflowRepository({
    persistencePath: CONTENT_FILE,
    seed: siteContentSeed
  });
}

function getRepository(): ContentStoreRepository {
  return getContentWorkflowRepository();
}

export async function readContent(repository = getRepository()): Promise<SiteContent> {
  noStore();
  return (await repository.readPublished()).content;
}

/** @deprecated Restricted to legacy persistence before workflow migration. */
export async function writeContent(content: SiteContent, repository = getRepository()) {
  await repository.replaceLegacyPublished(content);
}

const sectionNormalizers: Partial<Record<ContentSection, (payload: unknown) => unknown>> = {
  design: normalizeDesignSettings,
  pageBlocks: normalizePageBlockSettings
};

export async function updateContentSection<K extends ContentSection>(
  section: K,
  payload: ContentSectionMap[K],
  repository = getRepository()
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
  repository = getRepository()
): Promise<SiteContent> {
  return repository.mutateLegacyPublished((current) => {
    const pageBlocks = normalizePageBlockSettings({
      ...current.pageBlocks,
      [page]: blocks
    });
    return { ...current, pageBlocks } satisfies SiteContent;
  });
}

export async function resetContentToSeed(repository = getRepository()) {
  await writeContent(siteContentSeed, repository);
  return siteContentSeed;
}

export { CONTENT_FILE, siteContentSeed };
