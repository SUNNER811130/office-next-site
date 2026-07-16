"use client";

import { PageBlockEditor } from "@/components/admin/page-block-editor/page-block-editor";
import type { PageBlockEditorConfig, PageBlockEditorSnapshot } from "@/components/admin/page-block-editor/page-block-editor-types";
import { servicesBlockDefinitions, servicesPageBlockDefaults } from "@/lib/page-block-settings";

export const servicesBlockEditorConfig = {
  page: "services", pageLabel: "服務頁", previewPath: "/services", definitions: servicesBlockDefinitions,
  defaultBlocks: servicesPageBlockDefaults, saveLabel: "儲存服務頁區塊設定", resetLabel: "恢復服務頁預設區塊",
  resetDescription: "只把服務頁安全預設建立為草稿，不修改首頁、Design、服務內容、Email、報名網址或目前公開網站。",
  resetConfirmation: "只會建立 Services Page Blocks 預設草稿；必須另行發布才會公開。"
} satisfies PageBlockEditorConfig<"services">;

export function ServicesBlockEditor({ initialSnapshot }: { initialSnapshot: PageBlockEditorSnapshot<"services"> }) { return <PageBlockEditor initialSnapshot={initialSnapshot} config={servicesBlockEditorConfig} />; }
