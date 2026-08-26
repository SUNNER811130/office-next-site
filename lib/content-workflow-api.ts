import { NextResponse } from "next/server";

import {
  MalformedContentEnvelopeError,
  UnknownContentSchemaVersionError
} from "@/lib/content-envelope";
import {
  ContentMutationDisabledError,
  ContentDraftNotFoundError,
  ContentRevisionConflictError,
  ContentStorageMutationError,
  LegacyContentWriteBlockedError
} from "@/lib/content-workflow-errors";
import {
  resolveContentPersistenceConfig,
  type ContentMutationOperation
} from "@/lib/content-persistence-config";
import {
  assertContentMutationsEnabled,
  authorizeContentMutation,
  type AuthorizedContentMutation
} from "@/lib/content-mutation-gate";
import { ContentWorkflowRequestError } from "@/lib/content-workflow-request";
import type { ContentScope, EditorSnapshot } from "@/types/content-workflow";

const workflowResponseHeaders = {
  "Cache-Control": "private, no-store",
  Pragma: "no-cache",
  "X-Robots-Tag": "noindex, nofollow",
  Vary: "Cookie"
} as const;

type WorkflowErrorBody = {
  ok: false;
  error: {
    code: string;
    message: string;
    scope?: ContentScope;
    expectedDraftRevision?: number | null;
    currentDraftRevision?: number | null;
    expectedPublishedRevision?: number | null;
    currentPublishedRevision?: number;
  };
};

export function workflowJson(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: workflowResponseHeaders });
}

export function workflowSnapshotResponse<TScope extends ContentScope>(
  snapshot: EditorSnapshot<TScope>
): NextResponse {
  return workflowJson({ ok: true, snapshot });
}

export function workflowUnauthorizedResponse(): NextResponse {
  return workflowJson({
    ok: false,
    error: { code: "UNAUTHORIZED", message: "Admin authentication required" }
  }, 401);
}

export function assertWorkflowContentMutationsEnabled(): void {
  const config = resolveContentPersistenceConfig();
  assertContentMutationsEnabled(config.mutationPolicy, config);
}

export function authorizeWorkflowContentMutation(
  operation: ContentMutationOperation,
  scope: ContentScope
): AuthorizedContentMutation {
  return authorizeContentMutation(resolveContentPersistenceConfig(), operation, scope);
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  details: Partial<WorkflowErrorBody["error"]> = {}
): NextResponse {
  return workflowJson({ ok: false, error: { code, message, ...details } } satisfies WorkflowErrorBody, status);
}

export function workflowErrorResponse(error: unknown): NextResponse {
  if (error instanceof ContentWorkflowRequestError) {
    return errorResponse(error.status, error.code, error.message);
  }
  if (error instanceof ContentRevisionConflictError) {
    return errorResponse(409, "REVISION_CONFLICT", "Content changed since it was loaded", {
      scope: error.scope,
      expectedDraftRevision: error.expectedDraftRevision,
      currentDraftRevision: error.currentDraftRevision,
      expectedPublishedRevision: error.expectedPublishedRevision,
      currentPublishedRevision: error.currentPublishedRevision
    });
  }
  if (error instanceof ContentDraftNotFoundError) {
    return errorResponse(404, "DRAFT_NOT_FOUND", "Draft not found", { scope: error.scope });
  }
  if (error instanceof ContentMutationDisabledError) {
    return errorResponse(
      503,
      "CONTENT_MUTATIONS_DISABLED",
      "Content mutations are temporarily unavailable."
    );
  }
  if (error instanceof LegacyContentWriteBlockedError) {
    return errorResponse(409, "LEGACY_WRITE_BLOCKED", "Legacy content write is blocked after workflow migration");
  }
  if (
    error instanceof UnknownContentSchemaVersionError
    || error instanceof MalformedContentEnvelopeError
  ) {
    return errorResponse(500, "STORAGE_SCHEMA_ERROR", "Content storage schema is invalid");
  }
  if (error instanceof ContentStorageMutationError) {
    return errorResponse(500, "STORAGE_ERROR", "Content storage operation failed");
  }
  return errorResponse(500, "INTERNAL_ERROR", "Unexpected server error");
}
