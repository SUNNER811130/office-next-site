"use client";

import { useState } from "react";
import { ContentWorkflowActions } from "@/components/admin/content-workflow/content-workflow-actions";
import { ContentWorkflowConfirmDialog } from "@/components/admin/content-workflow/content-workflow-confirm-dialog";
import type { PageBlockConfig, PageBlockId, PageBlockSettings } from "@/types/content";
import { movePageBlock, updatePageBlock } from "./page-block-editor-helpers";
import { PageBlockControlCard } from "./page-block-control-card";
import { PageBlockPreview } from "./page-block-preview";
import type { PageBlockDefinition, PageBlockEditorConfig, PageBlockEditorPage, PageBlockEditorSnapshot } from "./page-block-editor-types";
import { usePageBlockWorkflow } from "./use-page-block-workflow";

export function PageBlockEditor<TPage extends PageBlockEditorPage>({ initialSnapshot, config }: { initialSnapshot: PageBlockEditorSnapshot<TPage>; config: PageBlockEditorConfig<TPage> }) {
  type Block = PageBlockSettings[TPage][number];
  const [previewWidth, setPreviewWidth] = useState(390);
  const [previewKey, setPreviewKey] = useState(0);
  const [resetOpen, setResetOpen] = useState(false);
  const workflow = usePageBlockWorkflow(config.page, initialSnapshot, () => setPreviewKey((key) => key + 1));

  const update = (index: number, patch: Partial<Block>) => {
    workflow.changeBlocks(updatePageBlock(workflow.blocks, index, patch) as PageBlockSettings[TPage]);
  };
  const move = (index: number, direction: -1 | 1) => {
    workflow.changeBlocks(movePageBlock(workflow.blocks, index, direction) as PageBlockSettings[TPage]);
  };

  return <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)]">
    <div className="grid min-w-0 gap-4">
      {workflow.blocks.map((block, index) => {
        const definition = config.definitions.find((item) => item.id === block.id) as PageBlockDefinition<PageBlockId>;
        return <PageBlockControlCard key={block.id} block={block as PageBlockConfig<PageBlockId>} definition={definition} index={index} total={workflow.blocks.length} onChange={(patch) => update(index, patch as Partial<Block>)} onMove={(direction) => move(index, direction)} />;
      })}
      <div className="rounded-[2rem] border border-red-900/15 bg-white/75 p-5">
        <h2 className="text-lg font-medium text-ink">{config.resetLabel}</h2><p className="mt-2 text-sm text-slate">{config.resetDescription}</p>
        <button type="button" onClick={() => setResetOpen(true)} disabled={workflow.operation !== null || workflow.conflict !== null} className="mt-4 rounded-full border border-red-800/30 px-4 py-2 text-sm text-red-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">{config.resetLabel}</button>
        {resetOpen ? <ContentWorkflowConfirmDialog id={`reset-${config.page}-blocks`} title={`將${config.pageLabel}預設 Page Blocks 建立為草稿？`} confirmLabel="確認建立 Reset Draft" tone="danger" onCancel={() => setResetOpen(false)} onConfirm={() => { setResetOpen(false); void workflow.save(config.defaultBlocks, "resetting"); }}><p>{config.resetConfirmation}</p><p>恢復預設會先建立草稿，不會立即更新公開網站。</p><p>現有未發布草稿與本地修改會由目前頁的預設值取代。</p></ContentWorkflowConfirmDialog> : null}
      </div>
      <ContentWorkflowActions snapshot={workflow.snapshot} dirty={workflow.dirty} operation={workflow.operation} notice={workflow.notice} error={workflow.error} conflict={workflow.conflict} onSave={() => void workflow.save()} onPublish={() => void workflow.publish()} onDiscard={() => void workflow.discard()} onReload={() => void workflow.reload()} />
    </div>
    <PageBlockPreview pageLabel={config.pageLabel} previewPath={config.previewPath} previewWidth={previewWidth} previewKey={previewKey} onWidthChange={setPreviewWidth} onRefresh={() => setPreviewKey((key) => key + 1)} />
  </div>;
}
