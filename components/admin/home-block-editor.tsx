"use client";

import { PageBlockEditor } from "@/components/admin/page-block-editor/page-block-editor";
import type { PageBlockEditorConfig } from "@/components/admin/page-block-editor/page-block-editor-types";
import { homeBlockDefinitions, pageBlockSettingsDefaults } from "@/lib/page-block-settings";
import type { PageBlockSettings } from "@/types/content";

export const homeBlockEditorConfig = {
  page: "home", pageLabel: "首頁", previewPath: "/", definitions: homeBlockDefinitions,
  defaultBlocks: pageBlockSettingsDefaults.home, saveLabel: "儲存首頁區塊設定", resetLabel: "恢復首頁預設區塊",
  resetDescription: "只重設首頁區塊呈現設定，不會修改首頁文字、Design、Email 或其他內容。",
  resetConfirmation: "順序、顯示、背景、動畫與版型會立即恢復預設。"
} satisfies PageBlockEditorConfig<"home">;

export function HomeBlockEditor({ initialValue }: { initialValue: PageBlockSettings }) { return <PageBlockEditor initialValue={initialValue} config={homeBlockEditorConfig} />; }
