import type { AdminWorkflowSection } from "@/lib/content-workflow-client";
import type { WorkflowOperation } from "@/components/admin/content-workflow/content-workflow-types";
import type { ContentScope, EditorSnapshot } from "@/types/content-workflow";

type PageBlockWorkflowScope = Extract<ContentScope, `pageBlocks.${string}`>;
export type WorkflowUiScope = AdminWorkflowSection | PageBlockWorkflowScope;
export type WorkflowUiSnapshot<TScope extends WorkflowUiScope> = Omit<EditorSnapshot<TScope>, "data">;

export const workflowScopeLabels: Record<WorkflowUiScope, string> = {
  brand: "品牌設定",
  home: "首頁內容",
  founder: "創辦人內容",
  services: "服務內容",
  testimonials: "客戶見證",
  faq: "常見問題",
  contact: "聯絡資訊",
  social: "社群連結",
  design: "網站視覺設計",
  "pageBlocks.home": "首頁 Page Blocks",
  "pageBlocks.services": "服務頁 Page Blocks",
  "pageBlocks.about": "關於頁 Page Blocks",
  "pageBlocks.contact": "聯絡頁 Page Blocks"
};

export function formatWorkflowTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Taipei"
  }).format(date);
}

export function getWorkflowActionAvailability(options: {
  hasDraft: boolean;
  dirty: boolean;
  operation: WorkflowOperation;
  hasConflict: boolean;
}) {
  const blocked = options.operation !== null || options.hasConflict;
  return {
    saveDisabled: !options.dirty || blocked,
    publishDisabled: !options.hasDraft || options.dirty || blocked,
    discardDisabled: !options.hasDraft || blocked
  };
}

export function getReloadedWorkflowState<TSnapshot extends { data: unknown }>(snapshot: TSnapshot): {
  snapshot: TSnapshot;
  value: TSnapshot["data"];
  dirty: false;
  conflict: null;
  error: "";
  notice: "idle";
} {
  return {
    snapshot,
    value: snapshot.data,
    dirty: false,
    conflict: null,
    error: "",
    notice: "idle" as const
  };
}
