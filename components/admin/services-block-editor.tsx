"use client";

import { useState } from "react";
import {
  normalizePageBlockSettings,
  servicesBlockDefinitions,
  servicesPageBlockDefaults
} from "@/lib/page-block-settings";
import type { PageBlockBackground, PageBlockLayout, PageBlockMotion, PageBlockSettings, ServicesBlockId } from "@/types/content";

const devices = [{ label: "手機", width: 390 }, { label: "平板", width: 768 }, { label: "桌機", width: 1280 }] as const;
const backgrounds: { value: PageBlockBackground; label: string }[] = [
  { value: "default", label: "原始背景" }, { value: "clean", label: "冷白純淨" }, { value: "soft-grid", label: "柔和科技網格" },
  { value: "soft-blue", label: "極淡藍灰" }, { value: "deep-panel", label: "深藍科技面板" }
];
const motions: { value: PageBlockMotion; label: string }[] = [
  { value: "inherit", label: "沿用全站" }, { value: "none", label: "無動畫" }, { value: "fade", label: "淡入" },
  { value: "fly-up", label: "向上淡入" }, { value: "fly-left", label: "由左淡入" }, { value: "fly-right", label: "由右淡入" }
];
const layoutLabels: Record<PageBlockLayout, string> = { default: "原始版型", contained: "收斂容器", wide: "寬版容器", "single-column": "單欄", "two-column": "雙欄" };

export function ServicesBlockEditor({ initialValue }: { initialValue: PageBlockSettings }) {
  const [value, setValue] = useState(() => normalizePageBlockSettings(initialValue));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [previewWidth, setPreviewWidth] = useState(390);
  const [previewKey, setPreviewKey] = useState(0);
  const [resetOpen, setResetOpen] = useState(false);

  const update = (index: number, patch: Partial<PageBlockSettings["services"][number]>) => {
    setValue((current) => ({ ...current, services: current.services.map((block, position) => position === index ? { ...block, ...patch } : block) }));
    setStatus("idle");
  };
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (index === 0 || target < 1 || target >= value.services.length) return;
    setValue((current) => {
      const services = [...current.services];
      [services[index], services[target]] = [services[target], services[index]];
      return { ...current, services: services.map((block, order) => ({ ...block, order })) };
    });
    setStatus("idle");
  };
  const save = async (blocks = value.services) => {
    setStatus("saving"); setError("");
    try {
      const response = await fetch("/api/admin/content/pageBlocks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: "services", blocks }) });
      const result = await response.json() as { data?: PageBlockSettings; error?: string };
      if (!response.ok || !result.data) throw new Error(result.error || "儲存失敗");
      setValue(normalizePageBlockSettings(result.data));
      setStatus("saved"); setPreviewKey((key) => key + 1);
    } catch (caught) { setStatus("error"); setError(caught instanceof Error ? caught.message : "儲存失敗"); }
  };
  const reset = async () => { await save(servicesPageBlockDefaults); setResetOpen(false); };

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)]">
      <div className="grid min-w-0 gap-4">
        {value.services.map((block, index) => {
          const definition = servicesBlockDefinitions.find((item) => item.id === block.id)!;
          return <article key={block.id} className="rounded-[2rem] border border-ink/10 bg-white/80 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[0.24em] text-bronze">{block.id}</p><h2 className="mt-2 text-xl font-medium text-ink">{definition.label}</h2><p className="mt-1 text-sm text-slate">{definition.description}</p></div><div className="text-right"><p className="text-sm text-slate">順序 {index + 1}</p>{!definition.canDisable ? <p className="mt-1 text-xs font-medium text-bronze">固定第一區塊</p> : null}</div></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="flex items-center justify-between rounded-xl border border-ink/10 px-4 py-3 text-sm text-slate">顯示區塊<input type="checkbox" checked={block.enabled} disabled={!definition.canDisable} onChange={(event) => update(index, { enabled: event.target.checked })} className="h-5 w-5 accent-ink" /></label>
              <div className="flex gap-2"><button type="button" aria-label={`將${definition.label}向上移動`} disabled={index <= 1} onClick={() => move(index, -1)} className="flex-1 rounded-xl border border-ink/10 px-3 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">向上</button><button type="button" aria-label={`將${definition.label}向下移動`} disabled={index === 0 || index === value.services.length - 1} onClick={() => move(index, 1)} className="flex-1 rounded-xl border border-ink/10 px-3 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">向下</button></div>
              <Select label="背景" value={block.background} options={backgrounds} onChange={(background) => update(index, { background: background as PageBlockBackground })} />
              <Select label="動畫" value={block.motion} options={motions} onChange={(motion) => update(index, { motion: motion as PageBlockMotion })} />
              <Select label="版型" value={block.layout} options={definition.supportedLayouts.map((layout) => ({ value: layout, label: layoutLabels[layout] }))} onChange={(layout) => update(index, { layout: layout as PageBlockLayout })} />
            </div>
          </article>;
        })}
        <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white/95 p-4 shadow-lg"><div className="text-sm" aria-live="polite">{status === "saving" ? "儲存中…" : status === "saved" ? "已儲存並刷新預覽" : status === "error" ? error : "變更只會在儲存後套用"}</div><button type="button" disabled={status === "saving"} onClick={() => save()} className="rounded-full bg-ink px-5 py-2.5 text-sm text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">儲存服務頁區塊設定</button></div>
        <div className="rounded-[2rem] border border-red-900/15 bg-white/75 p-5"><h2 className="text-lg font-medium text-ink">恢復服務頁預設區塊</h2><p className="mt-2 text-sm text-slate">只重設服務頁呈現設定，不修改首頁、Design、服務內容、Email 或報名網址。</p>{!resetOpen ? <button type="button" onClick={() => setResetOpen(true)} className="mt-4 rounded-full border border-red-800/30 px-4 py-2 text-sm text-red-800">恢復服務頁預設區塊</button> : <div role="alertdialog" aria-labelledby="reset-services-blocks" className="mt-4 rounded-2xl border border-red-800/20 bg-red-50 p-4"><p id="reset-services-blocks" className="font-medium text-red-900">確定恢復服務頁預設區塊？</p><p className="mt-1 text-sm text-red-800">只會立即重設 Services 區塊設定。</p><div className="mt-4 flex gap-2"><button type="button" onClick={reset} className="rounded-full bg-red-800 px-4 py-2 text-sm text-white">確認重設</button><button type="button" onClick={() => setResetOpen(false)} className="rounded-full border border-ink/15 px-4 py-2 text-sm">取消</button></div></div>}</div>
      </div>
      <aside className="min-w-0 xl:sticky xl:top-6 xl:self-start"><div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/85 p-4 shadow-[0_24px_70px_rgba(17,17,17,0.08)]"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[11px] uppercase tracking-[0.24em] text-bronze">Sticky Preview</p><p className="mt-1 text-sm text-slate">{previewWidth}px 寬</p></div><div className="flex flex-wrap gap-2">{devices.map((device) => <button key={device.width} type="button" aria-pressed={previewWidth === device.width} onClick={() => setPreviewWidth(device.width)} className="rounded-full border border-ink/10 px-3 py-2 text-xs aria-pressed:bg-ink aria-pressed:text-white">{device.label}</button>)}</div></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => setPreviewKey((key) => key + 1)} className="rounded-full border border-ink/10 px-3 py-2 text-xs">重新整理預覽</button><a href="/services" target="_blank" rel="noreferrer" className="rounded-full border border-ink/10 px-3 py-2 text-xs">在新分頁開啟服務頁</a></div><div className="mt-4 max-w-full overflow-auto rounded-2xl bg-slate/10 p-2"><iframe key={previewKey} src="/services" title={`服務頁 ${previewWidth}px 預覽`} style={{ width: previewWidth, maxWidth: "100%", height: 720 }} className="mx-auto block rounded-xl border border-ink/10 bg-white" /></div></div></aside>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly { value: string; label: string }[]; onChange: (value: string) => void }) {
  return <label className="grid gap-2 text-sm text-slate"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}
