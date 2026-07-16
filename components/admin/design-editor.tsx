"use client";

import { useState } from "react";

import { SectionEditor } from "@/components/admin/section-editor";
import { designFieldGroups, designFields } from "@/lib/admin-field-config";
import { designSettingsDefaults } from "@/lib/design-settings";
import type { EditorSnapshot } from "@/types/content-workflow";

const devices = [
  { label: "手機", width: 390 },
  { label: "平板", width: 768 },
  { label: "桌機", width: 1280 }
] as const;

export function DesignEditor({ initialSnapshot }: { initialSnapshot: EditorSnapshot<"design"> }) {
  const [previewWidth, setPreviewWidth] = useState(390);
  const [previewKey, setPreviewKey] = useState(0);

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)]">
      <div className="min-w-0">
        <SectionEditor
          section="design"
          initialSnapshot={initialSnapshot}
          fields={designFields}
          fieldGroups={designFieldGroups}
          onPublished={() => setPreviewKey((key) => key + 1)}
          resetDraft={{
            value: designSettingsDefaults,
            title: "恢復預設設計",
            description: "Reset 只會把安全預設值建立為未發布草稿，不影響品牌、內容或目前公開網站；必須 Publish 才會生效。"
          }}
        />
      </div>

      <aside className="min-w-0 xl:sticky xl:top-6 xl:self-start">
        <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/85 p-4 shadow-[0_24px_70px_rgba(17,17,17,0.08)]">
          <div className="rounded-2xl border border-amber-700/20 bg-amber-50 p-3 text-sm text-amber-900">
            目前預覽顯示已發布版本；草稿預覽將於 Preview 功能完成後提供。
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-[11px] uppercase tracking-[0.24em] text-bronze">Published Preview</p><p className="mt-1 text-sm text-slate">{previewWidth}px 寬</p></div>
            <div className="flex flex-wrap gap-2">
              {devices.map((device) => <button key={device.width} type="button" aria-pressed={previewWidth === device.width} onClick={() => setPreviewWidth(device.width)} className="rounded-full border border-ink/10 px-3 py-2 text-xs text-ink aria-pressed:bg-ink aria-pressed:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">{device.label}</button>)}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setPreviewKey((key) => key + 1)} className="rounded-full border border-ink/10 px-3 py-2 text-xs text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">重新整理已發布預覽</button>
            <a href="/" target="_blank" rel="noreferrer" className="rounded-full border border-ink/10 px-3 py-2 text-xs text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">在新分頁開啟前台</a>
          </div>
          <div className="mt-4 max-w-full overflow-auto rounded-2xl bg-slate/10 p-2">
            <iframe key={previewKey} src="/" title={`OFFICE NEXT 已發布前台 ${previewWidth}px 預覽`} style={{ width: previewWidth, maxWidth: "100%", height: 720 }} className="mx-auto block rounded-xl border border-ink/10 bg-white" />
          </div>
        </div>
      </aside>
    </div>
  );
}
