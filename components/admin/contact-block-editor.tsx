"use client";

import { PageBlockEditor } from "@/components/admin/page-block-editor/page-block-editor";
import type { PageBlockEditorConfig, PageBlockEditorSnapshot } from "@/components/admin/page-block-editor/page-block-editor-types";
import { contactBlockDefinitions, contactPageBlockDefaults } from "@/lib/page-block-settings";

export const contactBlockEditorConfig = {
  page: "contact", pageLabel: "聯絡頁", previewPath: "/contact", definitions: contactBlockDefinitions,
  defaultBlocks: contactPageBlockDefaults, saveLabel: "儲存聯絡頁區塊設定", resetLabel: "恢復聯絡頁預設區塊",
  resetDescription: "只把 Contact 安全預設建立為草稿，不修改正式 Email、聯絡內容、社群、其他頁面、Design 或目前公開網站。",
  resetConfirmation: "只會建立 Contact Page Blocks 預設草稿；必須另行發布才會公開。"
} satisfies PageBlockEditorConfig<"contact">;

export function ContactBlockEditor({ initialSnapshot }: { initialSnapshot: PageBlockEditorSnapshot<"contact"> }) { return <PageBlockEditor initialSnapshot={initialSnapshot} config={contactBlockEditorConfig} />; }
