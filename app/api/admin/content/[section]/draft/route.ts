import { type NextRequest } from "next/server";

import { rejectIfNotAdmin } from "@/lib/admin-auth";
import {
  authorizeWorkflowContentMutation,
  workflowErrorResponse,
  workflowSnapshotResponse,
  workflowUnauthorizedResponse
} from "@/lib/content-workflow-api";
import {
  parseDiscardDraftInput,
  parseSaveDraftInput,
  parseWorkflowJsonBody
} from "@/lib/content-workflow-request";
import { getContentWorkflowMutationRepository } from "@/lib/content-workflow-repository-factory";

type RouteContext = { params: Promise<{ section: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) return workflowUnauthorizedResponse();

  try {
    const { section } = await context.params;
    const input = parseSaveDraftInput(section, await parseWorkflowJsonBody(request));
    const authorization = authorizeWorkflowContentMutation("save-draft", input.scope);
    const repository = getContentWorkflowMutationRepository(authorization);
    const snapshot = await repository.saveDraft(input);
    return workflowSnapshotResponse(snapshot);
  } catch (error: unknown) {
    return workflowErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) return workflowUnauthorizedResponse();

  try {
    const { section } = await context.params;
    const input = parseDiscardDraftInput(section, await parseWorkflowJsonBody(request));
    const authorization = authorizeWorkflowContentMutation("discard-draft", input.scope);
    const repository = getContentWorkflowMutationRepository(authorization);
    const snapshot = await repository.discardDraft(input);
    return workflowSnapshotResponse(snapshot);
  } catch (error: unknown) {
    return workflowErrorResponse(error);
  }
}
