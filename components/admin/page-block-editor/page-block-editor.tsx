"use client";

import { useEffect, useRef, useState } from "react";
import { normalizePageBlockSettings } from "@/lib/page-block-settings";
import type { PageBlockConfig, PageBlockId, PageBlockSettings } from "@/types/content";
import { movePageBlock, requestPageBlockSave, updatePageBlock } from "./page-block-editor-helpers";
import { PageBlockControlCard } from "./page-block-control-card";
import { PageBlockPreview } from "./page-block-preview";
import type { PageBlockDefinition, PageBlockEditorConfig, PageBlockEditorPage, EditorStatus } from "./page-block-editor-types";

export function PageBlockEditor<TPage extends PageBlockEditorPage>({ initialValue, config }: { initialValue: PageBlockSettings; config: PageBlockEditorConfig<TPage> }) {
  type Block = PageBlockSettings[TPage][number];
  const [blocks, setBlocks] = useState<PageBlockSettings[TPage]>(() => normalizePageBlockSettings(initialValue)[config.page]);
  const [status, setStatus] = useState<EditorStatus>("idle");
  const [error, setError] = useState("");
  const [previewWidth, setPreviewWidth] = useState(390);
  const [previewKey, setPreviewKey] = useState(0);
  const [resetOpen, setResetOpen] = useState(false);
  const savingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const update = (index: number, patch: Partial<Block>) => {
    setBlocks((current) => updatePageBlock(current, index, patch) as PageBlockSettings[TPage]);
    setStatus("idle");
  };
  const move = (index: number, direction: -1 | 1) => {
    setBlocks((current) => movePageBlock(current, index, direction) as PageBlockSettings[TPage]);
    setStatus("idle");
  };
  const save = async (nextBlocks: PageBlockSettings[TPage] = blocks) => {
    if (savingRef.current) return false;
    savingRef.current = true;
    setStatus("saving");
    setError("");
    try {
      const savedSettings = await requestPageBlockSave(config.page, nextBlocks);
      if (mountedRef.current) {
        setBlocks(normalizePageBlockSettings(savedSettings)[config.page]);
        setStatus("saved");
        setPreviewKey((key) => key + 1);
      }
      return true;
    } catch (caught) {
      if (mountedRef.current) {
        setStatus("error");
        setError(caught instanceof Error ? caught.message : "儲存失敗");
      }
      return false;
    } finally {
      savingRef.current = false;
    }
  };
  const reset = async () => {
    if (await save(config.defaultBlocks)) setResetOpen(false);
  };

  return <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)]">
    <div className="grid min-w-0 gap-4">
      {blocks.map((block, index) => {
        const definition = config.definitions.find((item) => item.id === block.id) as PageBlockDefinition<PageBlockId>;
        return <PageBlockControlCard key={block.id} block={block as PageBlockConfig<PageBlockId>} definition={definition} index={index} total={blocks.length} onChange={(patch) => update(index, patch as Partial<Block>)} onMove={(direction) => move(index, direction)} />;
      })}
      <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white/95 p-4 shadow-lg"><div className="text-sm" aria-live="polite">{status === "saving" ? "儲存中…" : status === "saved" ? "已儲存並刷新預覽" : status === "error" ? error : "變更只會在儲存後套用"}</div><button type="button" disabled={status === "saving"} onClick={() => void save()} className="rounded-full bg-ink px-5 py-2.5 text-sm text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">{config.saveLabel}</button></div>
      <div className="rounded-[2rem] border border-red-900/15 bg-white/75 p-5">
        <h2 className="text-lg font-medium text-ink">{config.resetLabel}</h2><p className="mt-2 text-sm text-slate">{config.resetDescription}</p>
        {!resetOpen ? <button type="button" onClick={() => setResetOpen(true)} className="mt-4 rounded-full border border-red-800/30 px-4 py-2 text-sm text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">{config.resetLabel}</button> : <div role="alertdialog" aria-labelledby={`reset-${config.page}-blocks`} className="mt-4 rounded-2xl border border-red-800/20 bg-red-50 p-4"><p id={`reset-${config.page}-blocks`} className="font-medium text-red-900">確定{config.resetLabel}？</p><p className="mt-1 text-sm text-red-800">{config.resetConfirmation}</p><div className="mt-4 flex gap-2"><button type="button" disabled={status === "saving"} onClick={() => void reset()} className="rounded-full bg-red-800 px-4 py-2 text-sm text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">確認重設</button><button type="button" disabled={status === "saving"} onClick={() => setResetOpen(false)} className="rounded-full border border-ink/15 px-4 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">取消</button></div></div>}
      </div>
    </div>
    <PageBlockPreview pageLabel={config.pageLabel} previewPath={config.previewPath} previewWidth={previewWidth} previewKey={previewKey} onWidthChange={setPreviewWidth} onRefresh={() => setPreviewKey((key) => key + 1)} />
  </div>;
}
