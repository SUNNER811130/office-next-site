"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { AdminPreviewTarget } from "@/lib/admin-preview-types";

const previewDevices = [
  { label: "手機", width: 390 },
  { label: "平板", width: 768 },
  { label: "桌機", width: 1280 }
] as const;

type PreviewMode = "published" | "draft";

export function AdminPreviewFrame({
  target,
  pageLabel,
  publicPath,
  hasDraft,
  refreshKey = 0
}: {
  target: AdminPreviewTarget;
  pageLabel: string;
  publicPath: string;
  hasDraft: boolean;
  refreshKey?: number;
}) {
  const frameId = useId();
  const [mode, setMode] = useState<PreviewMode>("published");
  const [width, setWidth] = useState(390);
  const [manualRefresh, setManualRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hasDraft && mode === "draft") setMode("published");
  }, [hasDraft, mode]);

  const src = mode === "draft" ? `/admin/preview/${target}` : publicPath;
  const frameKey = `${mode}-${refreshKey}-${manualRefresh}`;

  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false);
      setLoadError(true);
    }, 12_000);
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, [frameKey, src]);

  const selectMode = (nextMode: PreviewMode) => {
    if (nextMode === "draft" && !hasDraft) return;
    setMode(nextMode);
  };

  return (
    <aside className="min-w-0 xl:sticky xl:top-6 xl:self-start">
      <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/85 p-4 shadow-[0_24px_70px_rgba(17,17,17,0.08)]">
        <div role="status" className={`rounded-2xl border p-3 text-sm ${mode === "draft" ? "border-amber-700/20 bg-amber-50 text-amber-900" : "border-ink/10 bg-white text-ink"}`}>
          {mode === "draft" ? "草稿預覽｜此內容尚未發布" : "已發布版本"}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-bronze">{mode === "draft" ? "Draft Preview" : "Published Preview"}</p>
            <p className="mt-1 text-sm text-slate">{width}px 寬</p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="預覽模式">
            <button type="button" aria-pressed={mode === "published"} aria-controls={frameId} onClick={() => selectMode("published")} className="rounded-full border border-ink/10 px-3 py-2 text-xs aria-pressed:bg-ink aria-pressed:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">已發布版本</button>
            <button type="button" aria-pressed={mode === "draft"} aria-controls={frameId} disabled={!hasDraft} onClick={() => selectMode("draft")} title={hasDraft ? undefined : "目前沒有草稿"} className="rounded-full border border-ink/10 px-3 py-2 text-xs aria-pressed:bg-ink aria-pressed:text-white disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">草稿預覽</button>
          </div>
        </div>

        {!hasDraft ? <p className="mt-2 text-xs text-slate">目前沒有草稿；Draft Preview 將使用已發布內容。</p> : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2" aria-label="預覽寬度">
            {previewDevices.map((device) => <button key={device.width} type="button" aria-pressed={width === device.width} aria-controls={frameId} onClick={() => setWidth(device.width)} className="rounded-full border border-ink/10 px-3 py-2 text-xs aria-pressed:bg-ink aria-pressed:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">{device.label}</button>)}
          </div>
          <button type="button" onClick={() => setManualRefresh((key) => key + 1)} className="rounded-full border border-ink/10 px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">重新整理預覽</button>
          <a href={src} target="_blank" rel="noreferrer" className="rounded-full border border-ink/10 px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">在新分頁開啟{pageLabel}</a>
        </div>

        <div className="mt-4" aria-live="polite">
          {loadError ? <div role="alert" className="mb-3 rounded-xl border border-red-900/15 bg-red-50 p-3 text-sm text-red-900">預覽載入逾時。請確認登入狀態後重新整理。</div> : null}
          <div className="max-w-full overflow-auto rounded-2xl bg-slate/10 p-2" aria-busy={loading}>
            <iframe
              id={frameId}
              key={frameKey}
              src={src}
              title={`${pageLabel} ${mode === "draft" ? "草稿" : "已發布"} ${width}px 預覽`}
              onLoad={() => {
                if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
                setLoading(false);
                setLoadError(false);
              }}
              style={{ width, maxWidth: "100%", height: 720 }}
              className="mx-auto block rounded-xl border border-ink/10 bg-white"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
