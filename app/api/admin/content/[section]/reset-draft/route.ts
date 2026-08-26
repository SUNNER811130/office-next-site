import { type NextRequest } from "next/server";

import { rejectIfNotAdmin } from "@/lib/admin-auth";
import { resolveContentResetDefaults } from "@/lib/content-reset-defaults";
import {
  authorizeWorkflowContentMutation,
  workflowErrorResponse,
  workflowSnapshotResponse,
  workflowUnauthorizedResponse
} from "@/lib/content-workflow-api";
import {
  parseResetDraftInput,
  parseWorkflowJsonBody
} from "@/lib/content-workflow-request";
import { getContentWorkflowMutationRepository } from "@/lib/content-workflow-repository-factory";

type RouteContext = { params: Promise<{ section: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) return workflowUnauthorizedResponse();

  try {
    const { section } = await context.params;
    const input = parseResetDraftInput(section, await parseWorkflowJsonBody(request));
    const value = resolveContentResetDefaults(input.scope);
    const authorization = authorizeWorkflowContentMutation("reset-draft", input.scope);
    const repository = getContentWorkflowMutationRepository(authorization);
    const snapshot = await repository.resetDraft({ ...input, value });
    return workflowSnapshotResponse(snapshot);
  } catch (error: unknown) {
    return workflowErrorResponse(error);
  }
}
