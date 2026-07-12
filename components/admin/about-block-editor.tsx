"use client";

import { PageBlockEditor } from "@/components/admin/page-block-editor/page-block-editor";
import type { PageBlockEditorConfig } from "@/components/admin/page-block-editor/page-block-editor-types";
import { aboutBlockDefinitions, aboutPageBlockDefaults } from "@/lib/page-block-settings";
import type { PageBlockSettings } from "@/types/content";

export const aboutBlockEditorConfig = {
  page: "about", pageLabel: "關於頁", previewPath: "/about", definitions: aboutBlockDefinitions,
  defaultBlocks: aboutPageBlockDefaults, saveLabel: "儲存關於頁區塊設定", resetLabel: "恢復關於頁預設區塊",
  resetDescription: "只重設 About 呈現設定，不修改 Founder 內容、其他頁面或 Design。",
  resetConfirmation: "只會立即重設 About 區塊設定。"
} satisfies PageBlockEditorConfig<"about">;

export function AboutBlockEditor({ initialValue }: { initialValue: PageBlockSettings }) { return <PageBlockEditor initialValue={initialValue} config={aboutBlockEditorConfig} />; }
