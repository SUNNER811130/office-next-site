import { promises as fs } from "fs";
import path from "path";

import { unstable_noStore as noStore } from "next/cache";

import { siteContentSeed } from "@/data/site-content.seed";
import { parseContentEnvelope, readPublishedSnapshot } from "@/lib/content-envelope";
import { normalizeDesignSettings } from "@/lib/design-settings";
import { normalizePageBlockSettings } from "@/lib/page-block-settings";
import type { ContentSection, ContentSectionMap, SiteContent } from "@/types/content";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");

export interface ILegacyContentRepository {
  read(): Promise<SiteContent>;
  write(content: SiteContent): Promise<void>;
}

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error
    && "code" in error
    && (error as Error & { code?: unknown }).code === "ENOENT";
}

class LocalFileContentRepository implements ILegacyContentRepository {
  private async ensureContentFile() {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
      await fs.access(CONTENT_FILE);
    } catch {
      await fs.writeFile(CONTENT_FILE, JSON.stringify(siteContentSeed, null, 2), "utf8");
    }
  }

  async read(): Promise<SiteContent> {
    try {
      const raw = await fs.readFile(CONTENT_FILE, "utf8");
      return readPublishedSnapshot(parseContentEnvelope(JSON.parse(raw))).content;
    } catch (error: unknown) {
      if (isMissingFileError(error)) return siteContentSeed;
      throw error;
    }
  }

  async write(content: SiteContent): Promise<void> {
    await this.ensureContentFile();
    await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf8");
  }
}

function getRepository(): ILegacyContentRepository {
  return new LocalFileContentRepository();
}

export async function readContent(): Promise<SiteContent> {
  noStore();
  return getRepository().read();
}

export async function writeContent(content: SiteContent) {
  await getRepository().write(content);
}

const sectionNormalizers: Partial<Record<ContentSection, (payload: unknown) => unknown>> = {
  design: normalizeDesignSettings,
  pageBlocks: normalizePageBlockSettings
};

export async function updateContentSection<K extends ContentSection>(
  section: K,
  payload: ContentSectionMap[K]
): Promise<SiteContent> {
  const current = await readContent();
  const normalizedPayload = (sectionNormalizers[section]?.(payload) ?? payload) as ContentSectionMap[K];
  const next = {
    ...current,
    [section]: normalizedPayload
  } satisfies SiteContent;

  await writeContent(next);
  return next;
}

export async function updatePageBlockPage(
  page: "home" | "services" | "about" | "contact",
  blocks: unknown
): Promise<SiteContent> {
  const current = await readContent();
  const pageBlocks = normalizePageBlockSettings({
    ...current.pageBlocks,
    [page]: blocks
  });
  const next = { ...current, pageBlocks } satisfies SiteContent;
  await writeContent(next);
  return next;
}

export async function resetContentToSeed() {
  await writeContent(siteContentSeed);
  return siteContentSeed;
}

export { CONTENT_FILE, siteContentSeed };
