import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";

export type CaseStudy = {
  slug: string;
  title: string;
  coverImageUrl: string;
  imageAltText: string;
  executiveSummary: string;
  challenge: string;
  solution: string;
  results: string[];
  htmlContent: string;
  publishedAt: string;
};

export const caseStudiesSeed: CaseStudy[] = [];

const DATA_DIR = path.join(process.cwd(), "data");
const CASES_FILE = path.join(DATA_DIR, "cases.json");

export interface ICaseRepository {
  readAll(): Promise<CaseStudy[]>;
  read(slug: string): Promise<CaseStudy | null>;
  create(post: CaseStudy): Promise<void>;
  update(slug: string, post: CaseStudy): Promise<void>;
  delete(slug: string): Promise<void>;
}

class LocalFileCaseRepository implements ICaseRepository {
  private async ensureFile() {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(CASES_FILE);
    } catch {
      await fs.writeFile(CASES_FILE, JSON.stringify(caseStudiesSeed, null, 2), "utf8");
    }
  }

  async readAll(): Promise<CaseStudy[]> {
    try {
      await this.ensureFile();
      const raw = await fs.readFile(CASES_FILE, "utf8");
      return (JSON.parse(raw) as CaseStudy[]) || [];
    } catch {
      return [];
    }
  }

  async read(slug: string): Promise<CaseStudy | null> {
    const all = await this.readAll();
    return all.find((p) => p.slug === slug) || null;
  }

  async create(post: CaseStudy): Promise<void> {
    const all = await this.readAll();
    all.unshift(post);
    await fs.writeFile(CASES_FILE, JSON.stringify(all, null, 2), "utf8");
  }

  async update(slug: string, post: CaseStudy): Promise<void> {
    const all = await this.readAll();
    const index = all.findIndex((p) => p.slug === slug);
    if (index >= 0) {
      all[index] = post;
      await fs.writeFile(CASES_FILE, JSON.stringify(all, null, 2), "utf8");
    }
  }

  async delete(slug: string): Promise<void> {
    const all = await this.readAll();
    const filtered = all.filter((p) => p.slug !== slug);
    await fs.writeFile(CASES_FILE, JSON.stringify(filtered, null, 2), "utf8");
  }
}

function getCaseRepository(): ICaseRepository {
  return new LocalFileCaseRepository();
}

export async function getAllCases() {
  noStore();
  return getCaseRepository().readAll();
}

export async function getCaseBySlug(slug: string) {
  noStore();
  return getCaseRepository().read(slug);
}

export async function createCase(post: CaseStudy) {
  return getCaseRepository().create(post);
}

export async function updateCase(slug: string, post: CaseStudy) {
  return getCaseRepository().update(slug, post);
}

export async function deleteCase(slug: string) {
  return getCaseRepository().delete(slug);
}
