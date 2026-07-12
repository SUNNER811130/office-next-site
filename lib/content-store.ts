import { promises as fs } from "fs";
import path from "path";

import { unstable_noStore as noStore } from "next/cache";

import { siteContentSeed } from "@/data/site-content.seed";
import { normalizeDesignSettings } from "@/lib/design-settings";
import { normalizePageBlockSettings } from "@/lib/page-block-settings";
import type { ContentSection, ContentSectionMap, SiteContent } from "@/types/content";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");

export interface IContentRepository {
  read(): Promise<SiteContent>;
  write(content: SiteContent): Promise<void>;
}

class LocalFileContentRepository implements IContentRepository {
  private async ensureContentFile() {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
      await fs.access(CONTENT_FILE);
    } catch {
      await fs.writeFile(CONTENT_FILE, JSON.stringify(siteContentSeed, null, 2), "utf8");
    }
  }

  async read(): Promise<SiteContent> {
    await this.ensureContentFile();
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      ...siteContentSeed,
      ...parsed,
      design: normalizeDesignSettings(parsed.design),
      pageBlocks: normalizePageBlockSettings(parsed.pageBlocks)
    };
  }

  async write(content: SiteContent): Promise<void> {
    await this.ensureContentFile();
    await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf8");
  }
}

function getRepository(): IContentRepository {
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

export async function resetContentToSeed() {
  await writeContent(siteContentSeed);
  return siteContentSeed;
}

export { CONTENT_FILE, siteContentSeed };
