import { pageBlockPreviewDevices } from "./page-block-editor-options";

export function PageBlockPreview({
  pageLabel,
  previewPath,
  previewWidth,
  previewKey,
  onWidthChange,
  onRefresh
}: {
  pageLabel: string;
  previewPath: string;
  previewWidth: number;
  previewKey: number;
  onWidthChange: (width: number) => void;
  onRefresh: () => void;
}) {
  return (
    <aside className="min-w-0 xl:sticky xl:top-6 xl:self-start">
      <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/85 p-4 shadow-[0_24px_70px_rgba(17,17,17,0.08)]">
        <div className="rounded-2xl border border-amber-700/20 bg-amber-50 p-3 text-sm text-amber-900">
          目前預覽顯示已發布版本；Page Block 草稿預覽將於 Preview 功能完成後提供。
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-[11px] uppercase tracking-[0.24em] text-bronze">Published Preview</p><p className="mt-1 text-sm text-slate">{previewWidth}px 寬</p></div>
          <div className="flex flex-wrap gap-2">{pageBlockPreviewDevices.map((device) => <button key={device.width} type="button" aria-pressed={previewWidth === device.width} onClick={() => onWidthChange(device.width)} className="rounded-full border border-ink/10 px-3 py-2 text-xs aria-pressed:bg-ink aria-pressed:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">{device.label}</button>)}</div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={onRefresh} className="rounded-full border border-ink/10 px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">重新整理已發布預覽</button>
          <a href={previewPath} target="_blank" rel="noreferrer" className="rounded-full border border-ink/10 px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">在新分頁開啟{pageLabel}</a>
        </div>
        <div className="mt-4 max-w-full overflow-auto rounded-2xl bg-slate/10 p-2"><iframe key={previewKey} src={previewPath} title={`${pageLabel} ${previewWidth}px 預覽`} style={{ width: previewWidth, maxWidth: "100%", height: 720 }} className="mx-auto block rounded-xl border border-ink/10 bg-white" /></div>
      </div>
    </aside>
  );
}
