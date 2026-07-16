"use client";

import { PageBlockEditor } from "@/components/admin/page-block-editor/page-block-editor";
import type { PageBlockEditorConfig, PageBlockEditorSnapshot } from "@/components/admin/page-block-editor/page-block-editor-types";
import { aboutBlockDefinitions, aboutPageBlockDefaults } from "@/lib/page-block-settings";

export const aboutBlockEditorConfig = {
  page: "about", pageLabel: "關於頁", previewPath: "/about", definitions: aboutBlockDefinitions,
  defaultBlocks: aboutPageBlockDefaults, saveLabel: "儲存關於頁區塊設定", resetLabel: "恢復關於頁預設區塊",
  resetDescription: "只把 About 安全預設建立為草稿，不修改 Founder 內容、其他頁面、Design 或目前公開網站。",
  resetConfirmation: "只會建立 About Page Blocks 預設草稿；必須另行發布才會公開。"
} satisfies PageBlockEditorConfig<"about">;

export function AboutBlockEditor({ initialSnapshot }: { initialSnapshot: PageBlockEditorSnapshot<"about"> }) { return <PageBlockEditor initialSnapshot={initialSnapshot} config={aboutBlockEditorConfig} />; }
