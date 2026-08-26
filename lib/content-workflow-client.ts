import type {
  ContentScope,
  EditorSnapshot,
  Revision,
  ScopeValue
} from "@/types/content-workflow";

export const adminWorkflowSections = [
  "brand",
  "home",
  "founder",
  "services",
  "testimonials",
  "faq",
  "contact",
  "social",
  "design"
] as const satisfies readonly ContentScope[];

export type AdminWorkflowSection = (typeof adminWorkflowSections)[number];

type WorkflowErrorDetails = {
  expectedDraftRevision: Revision | null;
  currentDraftRevision: Revision | null;
  expectedPublishedRevision: Revision | null;
  currentPublishedRevision: Revision | null;
};

export class ContentWorkflowClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly revisions: WorkflowErrorDetails;

  constructor(options: {
    code: string;
    status: number;
    message: string;
    revisions?: Partial<WorkflowErrorDetails>;
  }) {
    super(options.message);
    this.name = "ContentWorkflowClientError";
    this.code = options.code;
    this.status = options.status;
    this.revisions = {
      expectedDraftRevision: options.revisions?.expectedDraftRevision ?? null,
      currentDraftRevision: options.revisions?.currentDraftRevision ?? null,
      expectedPublishedRevision: options.revisions?.expectedPublishedRevision ?? null,
      currentPublishedRevision: options.revisions?.currentPublishedRevision ?? null
    };
  }
}

type RequestOptions = { signal?: AbortSignal };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isRevision(value: unknown): value is Revision {
  return Number.isInteger(value) && Number(value) > 0;
}

function optionalRevision(value: unknown): Revision | null {
  return isRevision(value) ? value : null;
}

function safeMessage(status: number): string {
  if (status === 401) return "登入狀態已失效，請重新登入後再試。";
  if (status === 409) return "內容版本已在其他分頁變更。";
  if (status >= 500) return "伺服器暫時無法處理內容，請稍後再試。";
  return "內容操作失敗，請確認後再試。";
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json() as unknown;
  } catch {
    return null;
  }
}

export function parseWorkflowResponse<TScope extends ContentScope>(
  section: TScope,
  response: Response,
  body: unknown
): EditorSnapshot<TScope> {
  if (!response.ok || !isRecord(body) || body.ok !== true) {
    const error = isRecord(body) && isRecord(body.error) ? body.error : {};
    throw new ContentWorkflowClientError({
      code: typeof error.code === "string" ? error.code : "REQUEST_FAILED",
      status: response.status,
      message: safeMessage(response.status),
      revisions: {
        expectedDraftRevision: optionalRevision(error.expectedDraftRevision),
        currentDraftRevision: optionalRevision(error.currentDraftRevision),
        expectedPublishedRevision: optionalRevision(error.expectedPublishedRevision),
        currentPublishedRevision: optionalRevision(error.currentPublishedRevision)
      }
    });
  }

  const snapshot = body.snapshot;
  if (
    !isRecord(snapshot)
    || snapshot.scope !== section
    || (snapshot.source !== "draft" && snapshot.source !== "published")
    || !isRevision(snapshot.publishedRevision)
    || (snapshot.draftRevision !== null && !isRevision(snapshot.draftRevision))
    || typeof snapshot.publishedUpdatedAt !== "string"
    || (snapshot.draftUpdatedAt !== null && typeof snapshot.draftUpdatedAt !== "string")
    || !("data" in snapshot)
  ) {
    throw new ContentWorkflowClientError({
      code: "INVALID_RESPONSE",
      status: response.status,
      message: "伺服器回傳的內容格式無法辨識。"
    });
  }

  return snapshot as EditorSnapshot<TScope>;
}

export async function parseWorkflowFetchResponse<TScope extends ContentScope>(
  section: TScope,
  response: Response
): Promise<EditorSnapshot<TScope>> {
  return parseWorkflowResponse(section, response, await readJson(response));
}

async function requestSnapshot<TScope extends AdminWorkflowSection>(
  section: TScope,
  endpoint: "editor" | "draft" | "publish" | "reset-draft",
  init: RequestInit
): Promise<EditorSnapshot<TScope>> {
  const response = await fetch(`/api/admin/content/${section}/${endpoint}`, init);
  return parseWorkflowFetchResponse(section, response);
}

export function loadEditorSnapshot<TScope extends AdminWorkflowSection>(
  section: TScope,
  options: RequestOptions = {}
): Promise<EditorSnapshot<TScope>> {
  return requestSnapshot(section, "editor", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
    signal: options.signal
  });
}

export function saveDraft<TScope extends AdminWorkflowSection>(
  section: TScope,
  data: ScopeValue<TScope>,
  revisions: Pick<EditorSnapshot<TScope>, "draftRevision" | "publishedRevision">,
  options: RequestOptions = {}
): Promise<EditorSnapshot<TScope>> {
  return requestSnapshot(section, "draft", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    signal: options.signal,
    body: JSON.stringify({
      data,
      expectedDraftRevision: revisions.draftRevision,
      expectedPublishedRevision: revisions.publishedRevision
    })
  });
}

export function publishDraft<TScope extends AdminWorkflowSection>(
  section: TScope,
  revisions: Pick<EditorSnapshot<TScope>, "draftRevision" | "publishedRevision"> & { draftRevision: Revision },
  options: RequestOptions = {}
): Promise<EditorSnapshot<TScope>> {
  return requestSnapshot(section, "publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    signal: options.signal,
    body: JSON.stringify({
      expectedDraftRevision: revisions.draftRevision,
      expectedPublishedRevision: revisions.publishedRevision
    })
  });
}

export function discardDraft<TScope extends AdminWorkflowSection>(
  section: TScope,
  expectedDraftRevision: Revision,
  options: RequestOptions = {}
): Promise<EditorSnapshot<TScope>> {
  return requestSnapshot(section, "draft", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    signal: options.signal,
    body: JSON.stringify({ expectedDraftRevision })
  });
}

export function resetDraft<TScope extends AdminWorkflowSection>(
  section: TScope,
  revisions: Pick<EditorSnapshot<TScope>, "draftRevision" | "publishedRevision">,
  options: RequestOptions = {}
): Promise<EditorSnapshot<TScope>> {
  return requestSnapshot(section, "reset-draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    signal: options.signal,
    body: JSON.stringify({
      expectedDraftRevision: revisions.draftRevision,
      expectedPublishedRevision: revisions.publishedRevision
    })
  });
}

export function isRevisionConflict(error: unknown): error is ContentWorkflowClientError {
  return error instanceof ContentWorkflowClientError
    && error.status === 409
    && error.code === "REVISION_CONFLICT";
}
