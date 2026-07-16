"use client";

import { PageBlockEditor } from "@/components/admin/page-block-editor/page-block-editor";
import type { PageBlockEditorConfig, PageBlockEditorSnapshot } from "@/components/admin/page-block-editor/page-block-editor-types";
import { homeBlockDefinitions, pageBlockSettingsDefaults } from "@/lib/page-block-settings";

export const homeBlockEditorConfig = {
  page: "home", pageLabel: "首頁", previewPath: "/", definitions: homeBlockDefinitions,
  defaultBlocks: pageBlockSettingsDefaults.home, saveLabel: "儲存首頁區塊設定", resetLabel: "恢復首頁預設區塊",
  resetDescription: "只把首頁安全預設建立為草稿，不會修改首頁文字、Design、Email、其他頁面或目前公開網站。",
  resetConfirmation: "順序、顯示、背景、動畫與版型會先恢復為草稿預設；必須另行發布才會公開。"
} satisfies PageBlockEditorConfig<"home">;

export function HomeBlockEditor({ initialSnapshot }: { initialSnapshot: PageBlockEditorSnapshot<"home"> }) { return <PageBlockEditor initialSnapshot={initialSnapshot} config={homeBlockEditorConfig} />; }
