import { formatWorkflowTime, workflowScopeLabels } from "@/components/admin/content-workflow/content-workflow-helpers";
import type { WorkflowNotice, WorkflowOperation } from "@/components/admin/content-workflow/content-workflow-types";
import type { AdminWorkflowSection } from "@/lib/content-workflow-client";
import type { EditorSnapshot } from "@/types/content-workflow";

const noticeLabels: Record<WorkflowNotice, string> = {
  idle: "內容已與伺服器版本同步",
  dirty: "草稿已修改但尚未儲存",
  saved: "草稿已儲存；公開網站尚未更新",
  published: "發布成功，公開網站已更新",
  discarded: "已放棄草稿並回到目前已發布內容",
  reset: "預設設計已儲存為草稿；公開網站尚未更新",
  error: "發生錯誤",
  conflict: "發生版本衝突"
};

const operationLabels: Record<Exclude<WorkflowOperation, null>, string> = {
  saving: "草稿儲存中",
  publishing: "發布中",
  discarding: "草稿放棄中",
  resetting: "預設設計草稿建立中",
  reloading: "伺服器版本重新載入中"
};

export function ContentWorkflowStatus<TScope extends AdminWorkflowSection>({
  snapshot,
  dirty,
  operation,
  notice,
  error
}: {
  snapshot: EditorSnapshot<TScope>;
  dirty: boolean;
  operation: WorkflowOperation;
  notice: WorkflowNotice;
  error: string;
}) {
  const statusText = operation ? operationLabels[operation] : noticeLabels[notice];
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-ink px-3 py-1 text-xs text-paper">
          {snapshot.source === "draft" ? "有未發布草稿" : "已發布版本"}
        </span>
        {dirty ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-900">尚未儲存</span> : null}
        <span className="text-xs text-slate">{workflowScopeLabels[snapshot.scope]}</span>
      </div>
      <p aria-live="polite" aria-atomic="true" className={notice === "error" || notice === "conflict" ? "text-sm text-red-700" : "text-sm text-slate"}>
        {statusText}{error ? `：${error}` : ""}
      </p>
      <dl className="grid gap-2 text-xs text-slate sm:grid-cols-2">
        <div><dt className="font-medium text-ink">Draft revision</dt><dd>{snapshot.draftRevision ?? "無草稿"} · {formatWorkflowTime(snapshot.draftUpdatedAt)}</dd></div>
        <div><dt className="font-medium text-ink">Published revision</dt><dd>{snapshot.publishedRevision} · {formatWorkflowTime(snapshot.publishedUpdatedAt)}</dd></div>
      </dl>
    </div>
  );
}
