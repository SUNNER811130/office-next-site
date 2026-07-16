"use client";

import { useState } from "react";

import { ContentWorkflowConfirmDialog } from "@/components/admin/content-workflow/content-workflow-confirm-dialog";
import { ContentWorkflowConflict } from "@/components/admin/content-workflow/content-workflow-conflict";
import { getWorkflowActionAvailability, workflowScopeLabels } from "@/components/admin/content-workflow/content-workflow-helpers";
import { ContentWorkflowStatus } from "@/components/admin/content-workflow/content-workflow-status";
import type { WorkflowConflict, WorkflowNotice, WorkflowOperation } from "@/components/admin/content-workflow/content-workflow-types";
import type { AdminWorkflowSection } from "@/lib/content-workflow-client";
import type { EditorSnapshot } from "@/types/content-workflow";

type DialogName = "publish" | "discard" | "reload" | null;

export function ContentWorkflowActions<TScope extends AdminWorkflowSection>({
  snapshot,
  dirty,
  operation,
  notice,
  error,
  conflict,
  onSave,
  onPublish,
  onDiscard,
  onReload
}: {
  snapshot: EditorSnapshot<TScope>;
  dirty: boolean;
  operation: WorkflowOperation;
  notice: WorkflowNotice;
  error: string;
  conflict: WorkflowConflict | null;
  onSave: () => void;
  onPublish: () => void;
  onDiscard: () => void;
  onReload: () => void;
}) {
  const [dialog, setDialog] = useState<DialogName>(null);
  const busy = operation !== null;
  const availability = getWorkflowActionAvailability({
    hasDraft: snapshot.draftRevision !== null,
    dirty,
    operation,
    hasConflict: conflict !== null
  });
  const label = workflowScopeLabels[snapshot.scope];

  const confirm = (action: () => void) => {
    setDialog(null);
    action();
  };

  return (
    <div className="sticky bottom-4 z-20 grid gap-4 rounded-[1.6rem] border border-ink/10 bg-white/95 p-4 shadow-[0_22px_60px_rgba(17,17,17,0.08)] backdrop-blur" aria-busy={busy}>
      <ContentWorkflowStatus snapshot={snapshot} dirty={dirty} operation={operation} notice={notice} error={error} />
      {conflict ? <ContentWorkflowConflict id={`${snapshot.scope}-conflict`} conflict={conflict} onReload={() => setDialog("reload")} /> : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onSave} disabled={availability.saveDisabled} className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">
          {operation === "saving" ? "儲存中" : "儲存草稿"}
        </button>
        <button type="button" onClick={() => setDialog("publish")} disabled={availability.publishDisabled} className="rounded-full border border-ink/20 px-5 py-3 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">
          {operation === "publishing" ? "發布中" : "發布"}
        </button>
        <button type="button" onClick={() => setDialog("discard")} disabled={availability.discardDisabled} className="rounded-full border border-red-800/25 px-5 py-3 text-sm font-medium text-red-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800/40">
          {operation === "discarding" ? "放棄中" : "放棄草稿"}
        </button>
      </div>

      {dialog === "publish" ? (
        <ContentWorkflowConfirmDialog id={`${snapshot.scope}-publish`} title={`發布「${label}」草稿？`} confirmLabel="確認發布" onCancel={() => setDialog(null)} onConfirm={() => confirm(onPublish)}>
          <p>Draft revision：{snapshot.draftRevision ?? "無草稿"}</p>
          <p>Published revision：{snapshot.publishedRevision}</p>
          <p>發布後公開網站才會更新。</p>
        </ContentWorkflowConfirmDialog>
      ) : null}
      {dialog === "discard" ? (
        <ContentWorkflowConfirmDialog id={`${snapshot.scope}-discard`} title={`放棄「${label}」草稿？`} confirmLabel="確認放棄草稿" tone="danger" onCancel={() => setDialog(null)} onConfirm={() => confirm(onDiscard)}>
          <p>未發布草稿會被刪除，並回到目前已發布內容。</p>
          <p>此操作不是歷史版本還原。</p>
          {dirty ? <p className="font-medium text-red-800">尚未儲存的本地修改也會消失。</p> : null}
        </ContentWorkflowConfirmDialog>
      ) : null}
      {dialog === "reload" ? (
        <ContentWorkflowConfirmDialog id={`${snapshot.scope}-reload`} title="重新載入伺服器版本？" confirmLabel="確認重新載入" tone="danger" onCancel={() => setDialog(null)} onConfirm={() => confirm(onReload)}>
          <p>目前畫面的本地修改將被伺服器最新版取代，且無法自動還原。</p>
          <p>請先複製需要保留的重要文字。</p>
        </ContentWorkflowConfirmDialog>
      ) : null}
    </div>
  );
}
