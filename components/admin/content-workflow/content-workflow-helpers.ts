import type { AdminWorkflowSection } from "@/lib/content-workflow-client";
import type { WorkflowOperation } from "@/components/admin/content-workflow/content-workflow-types";
import type { EditorSnapshot } from "@/types/content-workflow";

export const workflowScopeLabels: Record<AdminWorkflowSection, string> = {
  brand: "品牌設定",
  home: "首頁內容",
  founder: "創辦人內容",
  services: "服務內容",
  testimonials: "客戶見證",
  faq: "常見問題",
  contact: "聯絡資訊",
  social: "社群連結",
  design: "網站視覺設計"
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

export function getReloadedWorkflowState<TScope extends AdminWorkflowSection>(
  snapshot: EditorSnapshot<TScope>
) {
  return {
    snapshot,
    value: snapshot.data,
    dirty: false,
    conflict: null,
    error: "",
    notice: "idle" as const
  };
}
