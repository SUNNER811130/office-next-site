import type { ContentWorkflowClientError } from "@/lib/content-workflow-client";

export type WorkflowOperation = "saving" | "publishing" | "discarding" | "resetting" | "reloading" | null;

export type WorkflowNotice =
  | "idle"
  | "dirty"
  | "saved"
  | "published"
  | "discarded"
  | "reset"
  | "error"
  | "conflict";

export type WorkflowConflict = Pick<ContentWorkflowClientError, "revisions">;
