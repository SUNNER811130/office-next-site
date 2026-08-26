"use client";

import { useEffect, useState, type ReactElement } from "react";

import { ContentWorkflowActions } from "@/components/admin/content-workflow/content-workflow-actions";
import { ContentWorkflowConfirmDialog } from "@/components/admin/content-workflow/content-workflow-confirm-dialog";
import { useContentWorkflow } from "@/components/admin/content-workflow/use-content-workflow";
import { FieldGroup } from "@/components/admin/field-group";
import { MediaPicker } from "@/components/admin/media-picker";
import { AdminPreviewFrame } from "@/components/admin/preview/admin-preview-frame";
import { RepeaterField, type RepeaterSubField } from "@/components/admin/repeater-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SaveBar } from "@/components/admin/save-bar";
import type { AdminWorkflowSection } from "@/lib/content-workflow-client";
import type { MediaCategory } from "@/types/content";
import type { EditorSnapshot, ScopeValue } from "@/types/content-workflow";

type SimpleField = {
  type: "text" | "textarea" | "richtext";
  path: string;
  label: string;
  description?: string;
  placeholder?: string;
};

type MediaField = {
  type: "media";
  path: string;
  label: string;
  description?: string;
  category: MediaCategory;
  suggestedPath?: string;
};

type StringRepeaterField = {
  type: "string-list";
  path: string;
  label: string;
  itemLabel: string;
  description?: string;
  placeholder?: string;
};

type ObjectRepeaterField = {
  type: "object-list";
  path: string;
  label: string;
  itemLabel: string;
  description?: string;
  fields: RepeaterSubField[];
};

type SelectField = {
  type: "select";
  path: string;
  label: string;
  description?: string;
  options: Array<{ label: string; value: string | number }>;
};

type ToggleField = {
  type: "toggle";
  path: string;
  label: string;
  description?: string;
};

export type SectionField = SimpleField | MediaField | StringRepeaterField | ObjectRepeaterField | SelectField | ToggleField;

export type SectionFieldGroup = {
  title: string;
  description?: string;
  fields: SectionField[];
};

type SharedEditorProps = {
  fields: SectionField[];
  fieldGroups?: SectionFieldGroup[];
};

type LegacySectionEditorProps<T> = SharedEditorProps & {
  section: string;
  initialValue: T;
  onSaveAsync?: (value: T) => Promise<void>;
  onChange?: (value: T) => void;
  onSaved?: (value: T) => void;
};

type WorkflowSectionEditorProps<TScope extends AdminWorkflowSection> = SharedEditorProps & {
  section: TScope;
  initialSnapshot: EditorSnapshot<TScope>;
  onPublished?: () => void;
  resetDraft?: {
    value: ScopeValue<TScope>;
    title: string;
    description: string;
  };
};

const sectionPreviewConfig = {
  brand: { target: "home", pageLabel: "首頁", publicPath: "/" },
  home: { target: "home", pageLabel: "首頁", publicPath: "/" },
  founder: { target: "about", pageLabel: "關於頁", publicPath: "/about" },
  services: { target: "services", pageLabel: "服務頁", publicPath: "/services" },
  testimonials: { target: "home", pageLabel: "首頁", publicPath: "/" },
  faq: { target: "home", pageLabel: "首頁", publicPath: "/" },
  contact: { target: "contact", pageLabel: "聯絡頁", publicPath: "/contact" },
  social: { target: "contact", pageLabel: "聯絡頁", publicPath: "/contact" },
  design: { target: "home", pageLabel: "首頁", publicPath: "/" }
} as const satisfies Record<AdminWorkflowSection, {
  target: "home" | "services" | "about" | "contact";
  pageLabel: string;
  publicPath: string;
}>;

function getValue(target: unknown, path: string) {
  return path.split(".").reduce((current, part) => (current as Record<string, unknown>)?.[part], target);
}

function setPathValue<T>(target: T, path: string, value: unknown): T {
  const parts = path.split(".");
  const clone = structuredClone(target) as Record<string, unknown>;
  let current: Record<string, unknown> = clone;

  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      current[part] = value;
      return;
    }
    current[part] = { ...(current[part] as Record<string, unknown>) };
    current = current[part] as Record<string, unknown>;
  });

  return clone as T;
}

function SectionFields<T>({
  value,
  fields,
  fieldGroups,
  onChange
}: SharedEditorProps & { value: T; onChange: (value: T) => void }) {
  const updatePath = (path: string, next: unknown) => onChange(setPathValue(value, path, next));

  const renderField = (field: SectionField) => {
    if (field.type === "string-list") {
      return <RepeaterField key={field.path} label={field.label} description={field.description} items={(getValue(value, field.path) as string[]) ?? []} onChange={(next) => updatePath(field.path, next)} itemLabel={field.itemLabel} mode="strings" placeholder={field.placeholder} />;
    }
    if (field.type === "object-list") {
      return <RepeaterField key={field.path} label={field.label} description={field.description} items={(getValue(value, field.path) as Record<string, string>[]) ?? []} onChange={(next) => updatePath(field.path, next)} itemLabel={field.itemLabel} mode="objects" fields={field.fields} />;
    }
    if (field.type === "media") {
      return <FieldGroup key={field.path} title={field.label} description={field.description}><MediaPicker label={field.label} value={(getValue(value, field.path) as string) ?? ""} category={field.category} suggestedPath={field.suggestedPath} onChange={(next) => updatePath(field.path, next)} /></FieldGroup>;
    }
    if (field.type === "richtext") {
      return <FieldGroup key={field.path} title={field.label} description={field.description}><RichTextEditor value={(getValue(value, field.path) as string) ?? ""} onChange={(next) => updatePath(field.path, next)} placeholder={field.placeholder} /></FieldGroup>;
    }
    if (field.type === "select") {
      const current = getValue(value, field.path);
      return (
        <FieldGroup key={field.path} title={field.label} description={field.description}>
          <label className="grid gap-2 text-sm text-slate">
            <span>{field.label}</span>
            <select value={String(current ?? "")} onChange={(event) => { const option = field.options.find((item) => String(item.value) === event.target.value); if (option) updatePath(field.path, option.value); }} className="min-w-0 max-w-full rounded-[1.2rem] border border-ink/10 bg-[#fcfaf7] px-4 py-3 text-base text-ink outline-none transition focus-visible:border-ink/30 focus-visible:ring-2 focus-visible:ring-bronze/30">
              {field.options.map((option) => <option key={String(option.value)} value={String(option.value)}>{option.label}</option>)}
            </select>
          </label>
        </FieldGroup>
      );
    }
    if (field.type === "toggle") {
      const checked = getValue(value, field.path) === true;
      return <FieldGroup key={field.path} title={field.label} description={field.description}><label className="flex cursor-pointer items-center justify-between gap-4 rounded-[1.2rem] border border-ink/10 bg-[#fcfaf7] px-4 py-3 text-sm text-slate focus-within:ring-2 focus-within:ring-bronze/30"><span>{checked ? "已開啟" : "已關閉"}</span><input type="checkbox" checked={checked} onChange={(event) => updatePath(field.path, event.target.checked)} className="h-5 w-5 accent-ink" /></label></FieldGroup>;
    }

    const multiline = field.type === "textarea";
    const Element = multiline ? "textarea" : "input";
    return (
      <FieldGroup key={field.path} title={field.label} description={field.description}>
        <label className="grid gap-2 text-sm text-slate">
          <span>{field.label}</span>
          <Element value={(getValue(value, field.path) as string) ?? ""} onChange={(event) => updatePath(field.path, event.target.value)} placeholder={field.placeholder} rows={multiline ? 6 : undefined} className="rounded-[1.4rem] border border-ink/10 bg-[#fcfaf7] px-4 py-3 text-base text-ink outline-none transition focus:border-ink/25 focus:bg-white focus-visible:ring-2 focus-visible:ring-bronze/30" />
        </label>
      </FieldGroup>
    );
  };

  const activeGroups = fieldGroups ?? [{ title: "設定", fields }];
  return <>{activeGroups.map((group) => <section key={group.title} className="grid gap-4 rounded-[2rem] border border-ink/8 bg-white/55 p-4 md:p-5"><div><h2 className="text-xl font-medium text-ink">{group.title}</h2>{group.description ? <p className="mt-1 text-sm text-slate">{group.description}</p> : null}</div>{group.fields.map(renderField)}</section>)}</>;
}

function LegacySectionEditor<T>({ initialValue, fields, fieldGroups, onSaveAsync, onChange, onSaved }: LegacySectionEditorProps<T>) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => setValue(initialValue), [initialValue]);

  const change = (next: T) => {
    setValue(next);
    onChange?.(next);
    setStatus("idle");
  };

  return (
    <div className="grid gap-5">
      <SectionFields value={value} fields={fields} fieldGroups={fieldGroups} onChange={change} />
      <SaveBar status={status} error={error} onSave={async () => {
        setStatus("saving");
        setError("");
        try {
          if (!onSaveAsync) throw new Error("此編輯器未設定儲存方式");
          await onSaveAsync(value);
          setStatus("saved");
          onSaved?.(value);
        } catch (caught: unknown) {
          setStatus("error");
          setError(caught instanceof Error ? caught.message : "儲存失敗");
        }
      }} />
    </div>
  );
}

function WorkflowSectionEditor<TScope extends AdminWorkflowSection>({
  section,
  initialSnapshot,
  fields,
  fieldGroups,
  onPublished,
  resetDraft
}: WorkflowSectionEditorProps<TScope>) {
  const workflow = useContentWorkflow(initialSnapshot, onPublished);
  const [resetOpen, setResetOpen] = useState(false);
  const preview = sectionPreviewConfig[section];

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)]">
      <div className="grid min-w-0 gap-5">
        <SectionFields value={workflow.value} fields={fields} fieldGroups={fieldGroups} onChange={workflow.changeValue} />
        {resetDraft ? (
          <section className="rounded-[2rem] border border-red-900/15 bg-white/75 p-5">
            <h2 className="text-lg font-medium text-ink">{resetDraft.title}</h2>
            <p className="mt-2 text-sm text-slate">{resetDraft.description}</p>
            <button type="button" onClick={() => setResetOpen(true)} disabled={workflow.operation !== null || workflow.conflict !== null} className="mt-4 rounded-full border border-red-800/30 px-4 py-2 text-sm text-red-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800/30">建立預設設計草稿</button>
            {resetOpen ? <ContentWorkflowConfirmDialog id="reset-design" title="將預設設計建立為草稿？" confirmLabel="確認建立 Reset Draft" tone="danger" onCancel={() => setResetOpen(false)} onConfirm={() => { setResetOpen(false); void workflow.reset(); }}><p>目前 Published design 不會改變，必須另行 Publish 才會更新公開網站。</p><p>現有未發布草稿與本地修改會由預設設計取代。</p></ContentWorkflowConfirmDialog> : null}
          </section>
        ) : null}
        <ContentWorkflowActions snapshot={workflow.snapshot} dirty={workflow.dirty} operation={workflow.operation} notice={workflow.notice} error={workflow.error} conflict={workflow.conflict} onSave={() => void workflow.save()} onPublish={() => void workflow.publish()} onDiscard={() => void workflow.discard()} onReload={() => void workflow.reload()} />
      </div>
      <AdminPreviewFrame
        target={preview.target}
        pageLabel={preview.pageLabel}
        publicPath={preview.publicPath}
        hasDraft={workflow.snapshot.draftRevision !== null}
        refreshKey={(workflow.snapshot.draftRevision ?? 0) + workflow.snapshot.publishedRevision}
      />
    </div>
  );
}

export function SectionEditor<TScope extends AdminWorkflowSection>(props: WorkflowSectionEditorProps<TScope>): ReactElement;
export function SectionEditor<T>(props: LegacySectionEditorProps<T>): ReactElement;
export function SectionEditor(props: WorkflowSectionEditorProps<AdminWorkflowSection> | LegacySectionEditorProps<unknown>): ReactElement {
  if ("initialSnapshot" in props) return <WorkflowSectionEditor {...props} />;
  return <LegacySectionEditor {...props} />;
}
