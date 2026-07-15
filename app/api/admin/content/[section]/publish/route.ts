import { type NextRequest } from "next/server";

import { rejectIfNotAdmin } from "@/lib/admin-auth";
import {
  workflowErrorResponse,
  workflowSnapshotResponse,
  workflowUnauthorizedResponse
} from "@/lib/content-workflow-api";
import {
  parsePublishDraftInput,
  parseWorkflowJsonBody
} from "@/lib/content-workflow-request";
import { getContentWorkflowRepository } from "@/lib/content-store";

type RouteContext = { params: Promise<{ section: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) return workflowUnauthorizedResponse();

  try {
    const { section } = await context.params;
    const input = parsePublishDraftInput(section, await parseWorkflowJsonBody(request));
    const snapshot = await getContentWorkflowRepository().publishDraft(input);
    return workflowSnapshotResponse(snapshot);
  } catch (error: unknown) {
    return workflowErrorResponse(error);
  }
}
