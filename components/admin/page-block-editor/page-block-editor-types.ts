import type { PageBlockConfig, PageBlockId, PageBlockSettings } from "@/types/content";

export type PageBlockEditorPage = keyof PageBlockSettings;

export type PageBlockDefinition<TId extends PageBlockId> = {
  id: TId;
  label: string;
  description: string;
  canDisable: boolean;
  supportedLayouts: readonly PageBlockConfig<TId>["layout"][];
};

export type PageBlockEditorConfig<TPage extends PageBlockEditorPage> = {
  page: TPage;
  pageLabel: string;
  previewPath: string;
  definitions: readonly PageBlockDefinition<PageBlockSettings[TPage][number]["id"]>[];
  defaultBlocks: PageBlockSettings[TPage];
  saveLabel: string;
  resetLabel: string;
  resetDescription: string;
  resetConfirmation: string;
};

export type EditorStatus = "idle" | "saving" | "saved" | "error";
