import type { ContentScope, Revision } from "@/types/content-workflow";
import type {
  ContentMutationDisabledReason,
  ContentPersistenceDriver,
  ContentRuntimeEnvironment
} from "@/lib/content-persistence-config";

export type ContentMutationDisabledErrorReason =
  | ContentMutationDisabledReason
  | "LEGACY_MUTATIONS_REQUIRE_LOCAL_DRIVER";

export class ContentMutationDisabledError extends Error {
  readonly code = "CONTENT_MUTATIONS_DISABLED" as const;
  readonly environment: ContentRuntimeEnvironment;
  readonly driver: ContentPersistenceDriver;
  readonly reason: ContentMutationDisabledErrorReason;

  constructor(details: {
    environment: ContentRuntimeEnvironment;
    driver: ContentPersistenceDriver;
    reason: ContentMutationDisabledErrorReason;
  }) {
    super("Content mutations are disabled");
    this.name = "ContentMutationDisabledError";
    this.environment = details.environment;
    this.driver = details.driver;
    this.reason = details.reason;
  }
}

export type ContentRevisionConflictDetails = {
  scope: ContentScope;
  expectedDraftRevision: Revision | null;
  currentDraftRevision: Revision | null;
  expectedPublishedRevision: Revision | null;
  currentPublishedRevision: Revision;
};

export class ContentRevisionConflictError extends Error {
  readonly scope: ContentScope;
  readonly expectedDraftRevision: Revision | null;
  readonly currentDraftRevision: Revision | null;
  readonly expectedPublishedRevision: Revision | null;
  readonly currentPublishedRevision: Revision;

  constructor(details: ContentRevisionConflictDetails) {
    super(`Content revision conflict for scope: ${details.scope}`);
    this.name = "ContentRevisionConflictError";
    this.scope = details.scope;
    this.expectedDraftRevision = details.expectedDraftRevision;
    this.currentDraftRevision = details.currentDraftRevision;
    this.expectedPublishedRevision = details.expectedPublishedRevision;
    this.currentPublishedRevision = details.currentPublishedRevision;
  }
}

export class ContentDraftNotFoundError extends Error {
  readonly scope: ContentScope;

  constructor(scope: ContentScope) {
    super(`Content draft not found for scope: ${scope}`);
    this.name = "ContentDraftNotFoundError";
    this.scope = scope;
  }
}

export class LegacyContentWriteBlockedError extends Error {
  constructor() {
    super("Legacy content writes are blocked after workflow migration");
    this.name = "LegacyContentWriteBlockedError";
  }
}

export class ContentStorageMutationError extends Error {
  readonly fileName: string;

  constructor(fileName: string, cause: unknown) {
    super(`Content storage mutation failed for: ${fileName}`);
    this.name = "ContentStorageMutationError";
    this.fileName = fileName;
    (this as Error & { cause?: unknown }).cause = cause;
  }
}
