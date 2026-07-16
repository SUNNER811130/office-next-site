import { revalidatePath } from "next/cache";
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
import { getPublishedPagePath } from "@/lib/content-workflow-public-paths";
import { getContentWorkflowRepository } from "@/lib/content-store";

type RouteContext = { params: Promise<{ section: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) return workflowUnauthorizedResponse();

  try {
    const { section } = await context.params;
    const input = parsePublishDraftInput(section, await parseWorkflowJsonBody(request));
    const snapshot = await getContentWorkflowRepository().publishDraft(input);
    const publishedPagePath = getPublishedPagePath(input.scope);
    if (publishedPagePath !== null) revalidatePath(publishedPagePath, "page");
    return workflowSnapshotResponse(snapshot);
  } catch (error: unknown) {
    return workflowErrorResponse(error);
  }
}
