import type { PageBlockConfig, PageBlockId, PageBlockSettings } from "@/types/content";
import type { EditorSnapshot } from "@/types/content-workflow";

export type PageBlockEditorPage = keyof PageBlockSettings;
export type PageBlockWorkflowScope<TPage extends PageBlockEditorPage = PageBlockEditorPage> = `pageBlocks.${TPage}`;
export type PageBlockEditorSnapshot<TPage extends PageBlockEditorPage> = Omit<
  EditorSnapshot<PageBlockWorkflowScope<TPage>>,
  "data"
> & { data: PageBlockSettings[TPage] };

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
