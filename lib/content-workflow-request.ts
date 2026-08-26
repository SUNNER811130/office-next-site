import { contentScopes, isContentScope } from "@/lib/content-scopes";
import type {
  ContentScope,
  DiscardDraftInput,
  PublishDraftInput,
  Revision,
  SaveDraftInput,
  ScopeValue
} from "@/types/content-workflow";

type UnknownRecord = Record<string, unknown>;

export type WorkflowRequestErrorCode = "BAD_REQUEST" | "NOT_FOUND" | "UNPROCESSABLE_CONTENT";

export class ContentWorkflowRequestError extends Error {
  readonly code: WorkflowRequestErrorCode;
  readonly status: 400 | 404 | 422;

  constructor(code: WorkflowRequestErrorCode, message: string) {
    super(message);
    this.name = "ContentWorkflowRequestError";
    this.code = code;
    this.status = code === "NOT_FOUND"
      ? 404
      : code === "UNPROCESSABLE_CONTENT"
        ? 422
        : 400;
  }
}

export const workflowSections = contentScopes.filter(
  (scope): scope is Exclude<ContentScope, `pageBlocks.${string}`> => !scope.startsWith("pageBlocks.")
);

const workflowSectionSet: ReadonlySet<string> = new Set(workflowSections);
const pageBlockPages = ["home", "services", "about", "contact"] as const;
type PageBlockPage = (typeof pageBlockPages)[number];
const pageBlockPageSet: ReadonlySet<string> = new Set(pageBlockPages);

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOwn(record: UnknownRecord, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function requireExactKeys(record: UnknownRecord, allowed: readonly string[]): void {
  const allowedSet = new Set(allowed);
  const unexpected = Object.keys(record).find((key) => !allowedSet.has(key));
  if (unexpected) {
    throw new ContentWorkflowRequestError("BAD_REQUEST", `Unexpected request field: ${unexpected}`);
  }
}

function requireField(record: UnknownRecord, key: string): unknown {
  if (!hasOwn(record, key)) {
    throw new ContentWorkflowRequestError("BAD_REQUEST", `Missing required field: ${key}`);
  }
  return record[key];
}

function requireRevision(value: unknown, field: string): Revision {
  if (!Number.isInteger(value) || Number(value) < 1) {
    throw new ContentWorkflowRequestError("BAD_REQUEST", `${field} must be a positive integer`);
  }
  return Number(value);
}

function requireExpectedDraftRevision(value: unknown): Revision | null {
  if (value === null) return null;
  return requireRevision(value, "expectedDraftRevision");
}

function requirePage(value: unknown): PageBlockPage {
  if (typeof value !== "string" || !pageBlockPageSet.has(value)) {
    throw new ContentWorkflowRequestError("NOT_FOUND", "Unknown Page Blocks page");
  }
  return value as PageBlockPage;
}

function requireBlocks(value: unknown): ScopeValue<ContentScope> {
  if (!Array.isArray(value)) {
    throw new ContentWorkflowRequestError(
      "UNPROCESSABLE_CONTENT",
      "blocks must be an array"
    );
  }
  return value as ScopeValue<ContentScope>;
}

function pageBlockScope(page: PageBlockPage): ContentScope {
  const scope = `pageBlocks.${page}`;
  if (!isContentScope(scope)) {
    throw new ContentWorkflowRequestError("NOT_FOUND", "Unknown Page Blocks scope");
  }
  return scope;
}

export async function parseWorkflowJsonBody(request: Request): Promise<UnknownRecord> {
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    throw new ContentWorkflowRequestError("BAD_REQUEST", "Request body must be valid JSON");
  }
  if (!isRecord(value)) {
    throw new ContentWorkflowRequestError("BAD_REQUEST", "Request body must be an object");
  }
  return value;
}

export function parseWorkflowScope(section: string, page?: unknown): ContentScope {
  if (workflowSectionSet.has(section)) return section as ContentScope;
  if (section !== "pageBlocks") {
    throw new ContentWorkflowRequestError("NOT_FOUND", "Unknown content section");
  }
  return pageBlockScope(requirePage(page));
}

export function parseSaveDraftInput(
  section: string,
  body: UnknownRecord
): SaveDraftInput<ContentScope> {
  if (section === "pageBlocks") {
    requireExactKeys(body, ["page", "blocks", "expectedDraftRevision", "expectedPublishedRevision"]);
    const scope = parseWorkflowScope(section, requireField(body, "page"));
    return {
      scope,
      value: requireBlocks(requireField(body, "blocks")),
      expectedDraftRevision: requireExpectedDraftRevision(requireField(body, "expectedDraftRevision")),
      expectedPublishedRevision: requireRevision(
        requireField(body, "expectedPublishedRevision"),
        "expectedPublishedRevision"
      )
    };
  }

  const scope = parseWorkflowScope(section);
  requireExactKeys(body, ["data", "expectedDraftRevision", "expectedPublishedRevision"]);
  return {
    scope,
    value: requireField(body, "data") as ScopeValue<ContentScope>,
    expectedDraftRevision: requireExpectedDraftRevision(requireField(body, "expectedDraftRevision")),
    expectedPublishedRevision: requireRevision(
      requireField(body, "expectedPublishedRevision"),
      "expectedPublishedRevision"
    )
  };
}

export function parsePublishDraftInput(
  section: string,
  body: UnknownRecord
): PublishDraftInput<ContentScope> {
  if (section === "pageBlocks") {
    requireExactKeys(body, ["page", "expectedDraftRevision", "expectedPublishedRevision"]);
    return {
      scope: parseWorkflowScope(section, requireField(body, "page")),
      expectedDraftRevision: requireRevision(
        requireField(body, "expectedDraftRevision"),
        "expectedDraftRevision"
      ),
      expectedPublishedRevision: requireRevision(
        requireField(body, "expectedPublishedRevision"),
        "expectedPublishedRevision"
      )
    };
  }

  const scope = parseWorkflowScope(section);
  requireExactKeys(body, ["expectedDraftRevision", "expectedPublishedRevision"]);
  return {
    scope,
    expectedDraftRevision: requireRevision(
      requireField(body, "expectedDraftRevision"),
      "expectedDraftRevision"
    ),
    expectedPublishedRevision: requireRevision(
      requireField(body, "expectedPublishedRevision"),
      "expectedPublishedRevision"
    )
  };
}

export function parseDiscardDraftInput(
  section: string,
  body: UnknownRecord
): DiscardDraftInput<ContentScope> {
  if (section === "pageBlocks") {
    requireExactKeys(body, ["page", "expectedDraftRevision"]);
    return {
      scope: parseWorkflowScope(section, requireField(body, "page")),
      expectedDraftRevision: requireRevision(
        requireField(body, "expectedDraftRevision"),
        "expectedDraftRevision"
      )
    };
  }

  const scope = parseWorkflowScope(section);
  requireExactKeys(body, ["expectedDraftRevision"]);
  return {
    scope,
    expectedDraftRevision: requireRevision(
      requireField(body, "expectedDraftRevision"),
      "expectedDraftRevision"
    )
  };
}

export type ResetDraftRequestInput = Pick<
  SaveDraftInput<ContentScope>,
  "scope" | "expectedDraftRevision" | "expectedPublishedRevision"
>;

export function parseResetDraftInput(
  section: string,
  body: UnknownRecord
): ResetDraftRequestInput {
  if (section === "pageBlocks") {
    requireExactKeys(body, ["page", "expectedDraftRevision", "expectedPublishedRevision"]);
    return {
      scope: parseWorkflowScope(section, requireField(body, "page")),
      expectedDraftRevision: requireExpectedDraftRevision(
        requireField(body, "expectedDraftRevision")
      ),
      expectedPublishedRevision: requireRevision(
        requireField(body, "expectedPublishedRevision"),
        "expectedPublishedRevision"
      )
    };
  }

  requireExactKeys(body, ["expectedDraftRevision", "expectedPublishedRevision"]);
  return {
    scope: parseWorkflowScope(section),
    expectedDraftRevision: requireExpectedDraftRevision(
      requireField(body, "expectedDraftRevision")
    ),
    expectedPublishedRevision: requireRevision(
      requireField(body, "expectedPublishedRevision"),
      "expectedPublishedRevision"
    )
  };
}
