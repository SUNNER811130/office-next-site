import { pageBlockBackgroundOptions, pageBlockLayoutLabels, pageBlockMotionOptions } from "./page-block-editor-options";
import type { PageBlockDefinition } from "./page-block-editor-types";
import type { PageBlockConfig, PageBlockId } from "@/types/content";

export function PageBlockControlCard<TId extends PageBlockId>({ block, definition, index, total, onChange, onMove }: {
  block: PageBlockConfig<TId>;
  definition: PageBlockDefinition<TId>;
  index: number;
  total: number;
  onChange: (patch: Partial<PageBlockConfig<TId>>) => void;
  onMove: (direction: -1 | 1) => void;
}) {
  return <article className="rounded-[2rem] border border-ink/10 bg-white/80 p-5">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[0.24em] text-bronze">{block.id}</p><h2 className="mt-2 text-xl font-medium text-ink">{definition.label}</h2><p className="mt-1 text-sm text-slate">{definition.description}</p></div><div className="text-right"><p className="text-sm text-slate">順序 {index + 1}</p>{!definition.canDisable ? <p className="mt-1 text-xs font-medium text-bronze">固定第一區塊</p> : null}</div></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="flex items-center justify-between rounded-xl border border-ink/10 px-4 py-3 text-sm text-slate">顯示區塊<input type="checkbox" checked={block.enabled} disabled={!definition.canDisable} onChange={(event) => onChange({ enabled: event.target.checked })} className="h-5 w-5 accent-ink" /></label>
      <div className="flex gap-2"><button type="button" aria-label={`將${definition.label}向上移動`} disabled={index <= 1} onClick={() => onMove(-1)} className="flex-1 rounded-xl border border-ink/10 px-3 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">向上</button><button type="button" aria-label={`將${definition.label}向下移動`} disabled={index === 0 || index === total - 1} onClick={() => onMove(1)} className="flex-1 rounded-xl border border-ink/10 px-3 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">向下</button></div>
      <Select label="背景" value={block.background} options={pageBlockBackgroundOptions} onChange={(background) => onChange({ background })} />
      <Select label="動畫" value={block.motion} options={pageBlockMotionOptions} onChange={(motion) => onChange({ motion })} />
      <Select label="版型" value={block.layout} options={definition.supportedLayouts.map((layout) => ({ value: layout, label: pageBlockLayoutLabels[layout] }))} onChange={(layout) => onChange({ layout })} />
    </div>
  </article>;
}

function Select<TValue extends string>({ label, value, options, onChange }: { label: string; value: TValue; options: readonly { value: TValue; label: string }[]; onChange: (value: TValue) => void }) {
  return <label className="grid gap-2 text-sm text-slate"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value as TValue)} className="min-w-0 rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}
