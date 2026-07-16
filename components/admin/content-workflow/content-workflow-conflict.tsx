import type { WorkflowConflict } from "@/components/admin/content-workflow/content-workflow-types";

export function ContentWorkflowConflict({
  id,
  conflict,
  onReload
}: {
  id: string;
  conflict: WorkflowConflict;
  onReload: () => void;
}) {
  return (
    <section className="rounded-2xl border border-red-800/20 bg-red-50 p-4" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="font-medium text-red-900">草稿或已發布版本已在其他分頁變更</h3>
      <p className="mt-1 text-sm text-red-800">目前畫面內容尚未儲存且不會被自動覆蓋。請先複製重要文字，再重新載入伺服器版本；系統不會自動重試或合併。</p>
      <dl className="mt-3 grid gap-1 text-xs text-red-900 sm:grid-cols-2">
        <div><dt>目前伺服器 Draft revision</dt><dd>{conflict.revisions.currentDraftRevision ?? "無草稿"}</dd></div>
        <div><dt>目前伺服器 Published revision</dt><dd>{conflict.revisions.currentPublishedRevision ?? "未知"}</dd></div>
      </dl>
      <button type="button" onClick={onReload} className="mt-3 rounded-full border border-red-800/30 px-4 py-2 text-sm text-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800/40">
        重新載入伺服器版本
      </button>
    </section>
  );
}
