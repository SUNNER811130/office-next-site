"use client";

import { useState } from "react";

import { SectionEditor } from "@/components/admin/section-editor";
import { designFieldGroups, designFields } from "@/lib/admin-field-config";
import { designSettingsDefaults, normalizeDesignSettings } from "@/lib/design-settings";
import type { DesignSettings } from "@/types/content";

const devices = [
  { label: "手機", width: 390 },
  { label: "平板", width: 768 },
  { label: "桌機", width: 1280 }
] as const;

export function DesignEditor({ initialValue }: { initialValue: DesignSettings }) {
  const [previewWidth, setPreviewWidth] = useState(390);
  const [previewKey, setPreviewKey] = useState(0);
  const [resetOpen, setResetOpen] = useState(false);
  const [editorValue, setEditorValue] = useState(initialValue);

  const save = async (value: DesignSettings) => {
    const response = await fetch("/api/admin/content/design", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value)
    });
    const result = await response.json() as { data?: DesignSettings; error?: string };
    if (!response.ok || !result.data) throw new Error(result.error || "儲存失敗");
    setEditorValue(normalizeDesignSettings(result.data));
  };

  const reset = async () => {
    await save(designSettingsDefaults);
    setResetOpen(false);
    setPreviewKey((key) => key + 1);
  };

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)]">
      <div className="min-w-0">
        <SectionEditor
          key={JSON.stringify(editorValue)}
          section="design"
          initialValue={editorValue}
          fields={designFields}
          fieldGroups={designFieldGroups}
          onSaveAsync={save}
          onSaved={() => setPreviewKey((key) => key + 1)}
        />
        <div className="mt-5 rounded-[2rem] border border-red-900/15 bg-white/75 p-5">
          <h2 className="text-lg font-medium text-ink">恢復預設設計</h2>
          <p className="mt-2 text-sm text-slate">只會重設 Design 設定，不影響品牌、首頁、課程、Email、Founder、Cases、Insights 或 Media。</p>
          {!resetOpen ? (
            <button type="button" onClick={() => setResetOpen(true)} className="mt-4 rounded-full border border-red-800/30 px-4 py-2 text-sm text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800/30">恢復預設設計</button>
          ) : (
            <div role="alertdialog" aria-labelledby="reset-design-title" className="mt-4 rounded-2xl border border-red-800/20 bg-red-50 p-4">
              <p id="reset-design-title" className="font-medium text-red-900">確定只重設全站視覺設計？</p>
              <p className="mt-1 text-sm text-red-800">這會立即儲存預設設計，但不會變更任何內容資料。</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={reset} className="rounded-full bg-red-800 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800/30">確認重設 Design</button>
                <button type="button" onClick={() => setResetOpen(false)} className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink">取消</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <aside className="min-w-0 xl:sticky xl:top-6 xl:self-start">
        <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/85 p-4 shadow-[0_24px_70px_rgba(17,17,17,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-[11px] uppercase tracking-[0.24em] text-bronze">Sticky Preview</p><p className="mt-1 text-sm text-slate">{previewWidth}px 寬</p></div>
            <div className="flex flex-wrap gap-2">
              {devices.map((device) => <button key={device.width} type="button" aria-pressed={previewWidth === device.width} onClick={() => setPreviewWidth(device.width)} className="rounded-full border border-ink/10 px-3 py-2 text-xs text-ink aria-pressed:bg-ink aria-pressed:text-white">{device.label}</button>)}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setPreviewKey((key) => key + 1)} className="rounded-full border border-ink/10 px-3 py-2 text-xs text-ink">重新整理預覽</button>
            <a href="/" target="_blank" rel="noreferrer" className="rounded-full border border-ink/10 px-3 py-2 text-xs text-ink">在新分頁開啟前台</a>
          </div>
          <div className="mt-4 max-w-full overflow-auto rounded-2xl bg-slate/10 p-2">
            <iframe key={previewKey} src="/" title={`OFFICE NEXT 前台 ${previewWidth}px 預覽`} style={{ width: previewWidth, maxWidth: "100%", height: 720 }} className="mx-auto block rounded-xl border border-ink/10 bg-white" />
          </div>
        </div>
      </aside>
    </div>
  );
}
