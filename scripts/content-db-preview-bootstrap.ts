import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { Pool } from "pg";

import {
  bootstrapContentSite,
  ContentBootstrapConflictError,
  ContentBootstrapDatabaseError,
  ContentBootstrapInputError,
  OFFICE_NEXT_FORMAL_CONTENT_SHA256,
  verifyBootstrappedContentSite
} from "../database/preview-bootstrap";
import type { SiteContent } from "../types/content";

function requiredPreviewEnvironment(): "preview" {
  if (process.env.CONTENT_RUNTIME_ENVIRONMENT !== "preview") {
    throw new ContentBootstrapInputError("INVALID_BOOTSTRAP_ENVIRONMENT");
  }
  return "preview";
}

function requiredSiteKey(): string {
  const siteKey = process.env.CONTENT_SITE_KEY;
  if (!siteKey || siteKey.trim().length === 0 || siteKey.length > 128) {
    throw new ContentBootstrapInputError("INVALID_BOOTSTRAP_SITE_KEY");
  }
  return siteKey;
}

function requiredMigrationUrl(): string {
  const value = process.env.CONTENT_DATABASE_MIGRATION_URL;
  if (!value) throw new ContentBootstrapDatabaseError();
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
      throw new ContentBootstrapDatabaseError();
    }
  } catch {
    throw new ContentBootstrapDatabaseError();
  }
  return value;
}

async function loadFormalContent(): Promise<{
  content: SiteContent;
  sourceSha256: string;
}> {
  const sourcePath = path.resolve(process.cwd(), "data/site-content.json");
  const bytes = await fs.readFile(sourcePath);
  const sourceSha256 = createHash("sha256").update(bytes).digest("hex");
  if (sourceSha256 !== OFFICE_NEXT_FORMAL_CONTENT_SHA256) {
    throw new ContentBootstrapInputError("SOURCE_SHA256_MISMATCH");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(bytes.toString("utf8"));
  } catch {
    throw new ContentBootstrapInputError("INVALID_BOOTSTRAP_CONTENT");
  }
  return { content: parsed as SiteContent, sourceSha256 };
}

function safeError(error: unknown): string {
  if (error instanceof ContentBootstrapConflictError) {
    return `${error.code}: ${error.category}`;
  }
  if (error instanceof ContentBootstrapInputError || error instanceof ContentBootstrapDatabaseError) {
    return error.code;
  }
  return "CONTENT_PREVIEW_BOOTSTRAP_FAILED";
}

export async function runPreviewBootstrap(): Promise<void> {
  if (process.argv.slice(2).length !== 0) {
    throw new ContentBootstrapInputError("INVALID_BOOTSTRAP_ENVIRONMENT");
  }
  const environment = requiredPreviewEnvironment();
  const siteKey = requiredSiteKey();
  const connectionString = requiredMigrationUrl();
  const source = await loadFormalContent();
  const pool = new Pool({ connectionString, max: 2, connectionTimeoutMillis: 5_000 });
  try {
    const result = await bootstrapContentSite({
      pool,
      siteKey,
      environment,
      content: source.content,
      sourceSha256: source.sourceSha256,
      expectedSourceSha256: OFFICE_NEXT_FORMAL_CONTENT_SHA256
    });
    console.log(result.status);
    await verifyBootstrappedContentSite({
      pool,
      siteKey,
      environment,
      content: source.content
    });
    console.log("verified");
  } finally {
    await pool.end().catch(() => undefined);
  }
}

if (require.main === module) {
  runPreviewBootstrap().catch((error: unknown) => {
    console.error(safeError(error));
    process.exitCode = 1;
  });
}
