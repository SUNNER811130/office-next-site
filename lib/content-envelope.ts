import { siteContentSeed } from "@/data/site-content.seed";
import { normalizeDesignSettings } from "@/lib/design-settings";
import { normalizePageBlockSettings } from "@/lib/page-block-settings";
import {
  contentScopes,
  getScopeValue,
  isContentScope,
  mergeScopeValue,
  normalizeScopeValue
} from "@/lib/content-scopes";
import type { SiteContent } from "@/types/content";
import type {
  ContentDrafts,
  ContentEnvelopeV1,
  ContentScope,
  DraftRecord,
  EditorSnapshot,
  PublishedSnapshot,
  Revision,
  ScopeValue
} from "@/types/content-workflow";

export class ContentWorkflowSchemaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentWorkflowSchemaError";
  }
}

export class UnknownContentSchemaVersionError extends ContentWorkflowSchemaError {
  constructor(version: unknown) {
    super(`Unknown content workflow schema version: ${String(version)}`);
    this.name = "UnknownContentSchemaVersionError";
  }
}

export class MalformedContentEnvelopeError extends ContentWorkflowSchemaError {
  constructor(message: string) {
    super(`Malformed content envelope: ${message}`);
    this.name = "MalformedContentEnvelopeError";
  }
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOwn(record: UnknownRecord, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function requireRecord(value: unknown, path: string): UnknownRecord {
  if (!isRecord(value)) {
    throw new MalformedContentEnvelopeError(`${path} must be an object`);
  }
  return value;
}

function requireTimestamp(value: unknown, path: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new MalformedContentEnvelopeError(`${path} must be a non-empty timestamp`);
  }
  return value;
}

function requireRevision(value: unknown, path: string): Revision {
  if (!Number.isInteger(value) || Number(value) < 1) {
    throw new MalformedContentEnvelopeError(`${path} must be a positive integer`);
  }
  return Number(value);
}

function normalizePublishedContent(value: unknown): SiteContent {
  const parsed = requireRecord(value, "published.content") as Partial<SiteContent>;
  return {
    ...siteContentSeed,
    ...parsed,
    design: normalizeDesignSettings(parsed.design),
    pageBlocks: normalizePageBlockSettings(parsed.pageBlocks)
  };
}

function createScopeRevisions(value: unknown): Record<ContentScope, Revision> {
  const record = requireRecord(value, "published.scopeRevisions");
  const result = {} as Record<ContentScope, Revision>;
  for (const scope of contentScopes) {
    result[scope] = requireRevision(record[scope], `published.scopeRevisions.${scope}`);
  }
  return result;
}

function createScopeUpdatedAt(value: unknown): Record<ContentScope, string> {
  const record = requireRecord(value, "published.scopeUpdatedAt");
  const result = {} as Record<ContentScope, string>;
  for (const scope of contentScopes) {
    result[scope] = requireTimestamp(record[scope], `published.scopeUpdatedAt.${scope}`);
  }
  return result;
}

function parseDraftRecord<TScope extends ContentScope>(
  scope: TScope,
  value: unknown
): DraftRecord<ScopeValue<TScope>> {
  const record = requireRecord(value, `drafts.${scope}`);
  if (!hasOwn(record, "value")) {
    throw new MalformedContentEnvelopeError(`drafts.${scope}.value is required`);
  }
  return {
    value: normalizeScopeValue(scope, record.value),
    revision: requireRevision(record.revision, `drafts.${scope}.revision`),
    basedOnPublishedRevision: requireRevision(
      record.basedOnPublishedRevision,
      `drafts.${scope}.basedOnPublishedRevision`
    ),
    updatedAt: requireTimestamp(record.updatedAt, `drafts.${scope}.updatedAt`)
  };
}

function addDraft<TScope extends ContentScope>(
  drafts: ContentDrafts,
  scope: TScope,
  draft: DraftRecord<ScopeValue<TScope>>
): ContentDrafts {
  return { ...drafts, [scope]: draft } as ContentDrafts;
}

function parseDrafts(value: unknown): ContentDrafts {
  const record = requireRecord(value, "drafts");
  let drafts: ContentDrafts = {};
  for (const [scope, draftValue] of Object.entries(record)) {
    if (!isContentScope(scope)) {
      throw new MalformedContentEnvelopeError(`unknown draft scope: ${scope}`);
    }
    drafts = addDraft(drafts, scope, parseDraftRecord(scope, draftValue));
  }
  return drafts;
}

function parsePublishedSnapshot(value: unknown): PublishedSnapshot {
  const record = requireRecord(value, "published");
  if (!hasOwn(record, "content")) {
    throw new MalformedContentEnvelopeError("published.content is required");
  }
  return {
    content: normalizePublishedContent(record.content),
    revision: requireRevision(record.revision, "published.revision"),
    updatedAt: requireTimestamp(record.updatedAt, "published.updatedAt"),
    scopeRevisions: createScopeRevisions(record.scopeRevisions),
    scopeUpdatedAt: createScopeUpdatedAt(record.scopeUpdatedAt)
  };
}

export function isLegacySiteContent(value: unknown): value is Partial<SiteContent> {
  return isRecord(value) && !hasOwn(value, "schemaVersion") && !hasOwn(value, "published");
}

function initialScopeRevisions(): Record<ContentScope, Revision> {
  return Object.fromEntries(contentScopes.map((scope) => [scope, 1])) as Record<ContentScope, Revision>;
}

function initialScopeUpdatedAt(timestamp: string): Record<ContentScope, string> {
  return Object.fromEntries(contentScopes.map((scope) => [scope, timestamp])) as Record<ContentScope, string>;
}

export function createEnvelopeFromLegacy(
  value: unknown,
  migrationBaseline = new Date().toISOString()
): ContentEnvelopeV1 {
  if (!isLegacySiteContent(value)) {
    throw new MalformedContentEnvelopeError("legacy content must be an object without workflow fields");
  }
  const updatedAt = requireTimestamp(migrationBaseline, "migrationBaseline");
  return {
    schemaVersion: 1,
    published: {
      content: normalizePublishedContent(value),
      revision: 1,
      updatedAt,
      scopeRevisions: initialScopeRevisions(),
      scopeUpdatedAt: initialScopeUpdatedAt(updatedAt)
    },
    drafts: {}
  };
}

export function parseContentEnvelopeV1(value: unknown): ContentEnvelopeV1 {
  const record = requireRecord(value, "root");
  if (record.schemaVersion !== 1) {
    throw new UnknownContentSchemaVersionError(record.schemaVersion);
  }
  if (!hasOwn(record, "published") || !hasOwn(record, "drafts")) {
    throw new MalformedContentEnvelopeError("published and drafts are required");
  }
  return {
    schemaVersion: 1,
    published: parsePublishedSnapshot(record.published),
    drafts: parseDrafts(record.drafts)
  };
}

export function isContentEnvelopeV1(value: unknown): boolean {
  if (!isRecord(value) || value.schemaVersion !== 1) return false;
  try {
    parseContentEnvelopeV1(value);
    return true;
  } catch {
    return false;
  }
}

export function parseContentEnvelope(
  value: unknown,
  options: { migrationBaseline?: string } = {}
): ContentEnvelopeV1 {
  const record = requireRecord(value, "root");
  if (hasOwn(record, "schemaVersion")) {
    if (record.schemaVersion !== 1) {
      throw new UnknownContentSchemaVersionError(record.schemaVersion);
    }
    return parseContentEnvelopeV1(record);
  }
  if (hasOwn(record, "published")) {
    throw new MalformedContentEnvelopeError("published envelope is missing schemaVersion");
  }
  return createEnvelopeFromLegacy(record, options.migrationBaseline);
}

export function readPublishedSnapshot(envelope: ContentEnvelopeV1): PublishedSnapshot {
  return envelope.published;
}

function getDraft<TScope extends ContentScope>(
  drafts: ContentDrafts,
  scope: TScope
): DraftRecord<ScopeValue<TScope>> | undefined {
  return drafts[scope] as DraftRecord<ScopeValue<TScope>> | undefined;
}

export function createEditorSnapshot<TScope extends ContentScope>(
  envelope: ContentEnvelopeV1,
  scope: TScope
): EditorSnapshot<TScope> {
  const draft = getDraft(envelope.drafts, scope);
  return {
    scope,
    data: draft ? normalizeScopeValue(scope, draft.value) : getScopeValue(envelope.published.content, scope),
    source: draft ? "draft" : "published",
    draftRevision: draft?.revision ?? null,
    publishedRevision: envelope.published.scopeRevisions[scope],
    draftUpdatedAt: draft?.updatedAt ?? null,
    publishedUpdatedAt: envelope.published.scopeUpdatedAt[scope]
  };
}

export function createPreviewContent(
  envelope: ContentEnvelopeV1,
  scope: ContentScope
): SiteContent {
  const draft = getDraft(envelope.drafts, scope);
  if (!draft) return envelope.published.content;
  return mergeScopeValue(
    envelope.published.content,
    scope,
    normalizeScopeValue(scope, draft.value)
  );
}

export function contentEnvelopeHasDrafts(envelope: ContentEnvelopeV1): boolean {
  return contentScopes.some((scope) => getDraft(envelope.drafts, scope) !== undefined);
}
