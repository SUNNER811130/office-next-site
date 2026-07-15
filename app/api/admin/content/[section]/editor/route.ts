import { type NextRequest } from "next/server";

import { rejectIfNotAdmin } from "@/lib/admin-auth";
import {
  workflowErrorResponse,
  workflowSnapshotResponse,
  workflowUnauthorizedResponse
} from "@/lib/content-workflow-api";
import { parseWorkflowScope } from "@/lib/content-workflow-request";
import { getContentWorkflowRepository } from "@/lib/content-store";

type RouteContext = { params: Promise<{ section: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) return workflowUnauthorizedResponse();

  try {
    const { section } = await context.params;
    const scope = parseWorkflowScope(section, request.nextUrl.searchParams.get("page"));
    const snapshot = await getContentWorkflowRepository().readEditor(scope);
    return workflowSnapshotResponse(snapshot);
  } catch (error: unknown) {
    return workflowErrorResponse(error);
  }
}
