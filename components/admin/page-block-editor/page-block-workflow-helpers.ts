import { parseWorkflowFetchResponse } from "@/lib/content-workflow-client";
import type { PageBlockSettings } from "@/types/content";
import type { Revision } from "@/types/content-workflow";
import type {
  PageBlockEditorPage,
  PageBlockEditorSnapshot,
  PageBlockWorkflowScope
} from "./page-block-editor-types";

type RequestOptions = {
  signal?: AbortSignal;
  request?: typeof fetch;
};

export function getPageBlockWorkflowScope<TPage extends PageBlockEditorPage>(
  page: TPage
): PageBlockWorkflowScope<TPage> {
  return `pageBlocks.${page}`;
}

export function createPageBlockSaveDraftPayload<TPage extends PageBlockEditorPage>(
  page: TPage,
  blocks: PageBlockSettings[TPage],
  revisions: Pick<PageBlockEditorSnapshot<TPage>, "draftRevision" | "publishedRevision">
) {
  return {
    page,
    blocks,
    expectedDraftRevision: revisions.draftRevision,
    expectedPublishedRevision: revisions.publishedRevision
  };
}

export function createPageBlockPublishPayload<TPage extends PageBlockEditorPage>(
  page: TPage,
  revisions: { draftRevision: Revision; publishedRevision: Revision }
) {
  return {
    page,
    expectedDraftRevision: revisions.draftRevision,
    expectedPublishedRevision: revisions.publishedRevision
  };
}

export function createPageBlockDiscardPayload<TPage extends PageBlockEditorPage>(
  page: TPage,
  expectedDraftRevision: Revision
) {
  return { page, expectedDraftRevision };
}

async function requestPageBlockSnapshot<TPage extends PageBlockEditorPage>(
  page: TPage,
  path: string,
  init: RequestInit,
  request: typeof fetch
): Promise<PageBlockEditorSnapshot<TPage>> {
  const response = await request(path, init);
  return await parseWorkflowFetchResponse(getPageBlockWorkflowScope(page), response) as PageBlockEditorSnapshot<TPage>;
}

export function loadPageBlockEditorSnapshot<TPage extends PageBlockEditorPage>(
  page: TPage,
  options: RequestOptions = {}
): Promise<PageBlockEditorSnapshot<TPage>> {
  return requestPageBlockSnapshot(page, `/api/admin/content/pageBlocks/editor?page=${encodeURIComponent(page)}`, {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
    signal: options.signal
  }, options.request ?? fetch);
}

export function savePageBlockDraft<TPage extends PageBlockEditorPage>(
  page: TPage,
  blocks: PageBlockSettings[TPage],
  revisions: Pick<PageBlockEditorSnapshot<TPage>, "draftRevision" | "publishedRevision">,
  options: RequestOptions = {}
): Promise<PageBlockEditorSnapshot<TPage>> {
  return requestPageBlockSnapshot(page, "/api/admin/content/pageBlocks/draft", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    signal: options.signal,
    body: JSON.stringify(createPageBlockSaveDraftPayload(page, blocks, revisions))
  }, options.request ?? fetch);
}

export function publishPageBlockDraft<TPage extends PageBlockEditorPage>(
  page: TPage,
  revisions: { draftRevision: Revision; publishedRevision: Revision },
  options: RequestOptions = {}
): Promise<PageBlockEditorSnapshot<TPage>> {
  return requestPageBlockSnapshot(page, "/api/admin/content/pageBlocks/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    signal: options.signal,
    body: JSON.stringify(createPageBlockPublishPayload(page, revisions))
  }, options.request ?? fetch);
}

export function discardPageBlockDraft<TPage extends PageBlockEditorPage>(
  page: TPage,
  expectedDraftRevision: Revision,
  options: RequestOptions = {}
): Promise<PageBlockEditorSnapshot<TPage>> {
  return requestPageBlockSnapshot(page, "/api/admin/content/pageBlocks/draft", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    signal: options.signal,
    body: JSON.stringify(createPageBlockDiscardPayload(page, expectedDraftRevision))
  }, options.request ?? fetch);
}
