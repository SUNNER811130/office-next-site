"use client";

import { PageBlockEditor } from "@/components/admin/page-block-editor/page-block-editor";
import type { PageBlockEditorConfig } from "@/components/admin/page-block-editor/page-block-editor-types";
import { servicesBlockDefinitions, servicesPageBlockDefaults } from "@/lib/page-block-settings";
import type { PageBlockSettings } from "@/types/content";

export const servicesBlockEditorConfig = {
  page: "services", pageLabel: "服務頁", previewPath: "/services", definitions: servicesBlockDefinitions,
  defaultBlocks: servicesPageBlockDefaults, saveLabel: "儲存服務頁區塊設定", resetLabel: "恢復服務頁預設區塊",
  resetDescription: "只重設服務頁呈現設定，不修改首頁、Design、服務內容、Email 或報名網址。",
  resetConfirmation: "只會立即重設 Services 區塊設定。"
} satisfies PageBlockEditorConfig<"services">;

export function ServicesBlockEditor({ initialValue }: { initialValue: PageBlockSettings }) { return <PageBlockEditor initialValue={initialValue} config={servicesBlockEditorConfig} />; }
