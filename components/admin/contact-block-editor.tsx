"use client";

import { PageBlockEditor } from "@/components/admin/page-block-editor/page-block-editor";
import type { PageBlockEditorConfig } from "@/components/admin/page-block-editor/page-block-editor-types";
import { contactBlockDefinitions, contactPageBlockDefaults } from "@/lib/page-block-settings";
import type { PageBlockSettings } from "@/types/content";

export const contactBlockEditorConfig = {
  page: "contact", pageLabel: "聯絡頁", previewPath: "/contact", definitions: contactBlockDefinitions,
  defaultBlocks: contactPageBlockDefaults, saveLabel: "儲存聯絡頁區塊設定", resetLabel: "恢復聯絡頁預設區塊",
  resetDescription: "只重設 Contact 呈現設定，不修改正式 Email、聯絡內容、社群、其他頁面或 Design。",
  resetConfirmation: "只會立即重設 Contact 區塊設定。"
} satisfies PageBlockEditorConfig<"contact">;

export function ContactBlockEditor({ initialValue }: { initialValue: PageBlockSettings }) { return <PageBlockEditor initialValue={initialValue} config={contactBlockEditorConfig} />; }
