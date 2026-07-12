"use client";

import { useState, useEffect } from "react";

import { FieldGroup } from "@/components/admin/field-group";
import { MediaPicker } from "@/components/admin/media-picker";
import { RepeaterField, type RepeaterSubField } from "@/components/admin/repeater-field";
import { SaveBar } from "@/components/admin/save-bar";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import type { MediaCategory } from "@/types/content";

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

function getValue(target: unknown, path: string) {
  return path.split(".").reduce((current, part) => (current as Record<string, unknown>)?.[part], target);
}

function setValue<T>(target: T, path: string, value: unknown): T {
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

export function SectionEditor<T>({
  section,
  initialValue,
  fields,
  onSaveAsync,
  onChange,
  onSaved,
  fieldGroups
}: {
  section: string;
  initialValue: T;
  fields: SectionField[];
  onSaveAsync?: (value: T) => Promise<void>;
  onChange?: (value: T) => void;
  onSaved?: (value: T) => void;
  fieldGroups?: SectionFieldGroup[];
}) {
  const [value, setValueState] = useState(initialValue);

  useEffect(() => {
    setValueState(initialValue);
  }, [initialValue]);

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const updatePath = (path: string, next: unknown) => {
    const nextVal = setValue(value, path, next);
    setValueState(nextVal);
    if (onChange) onChange(nextVal);
    setStatus("idle");
  };

  const renderField = (field: SectionField) => {
        if (field.type === "string-list") {
          return (
            <RepeaterField
              key={field.path}
              label={field.label}
              description={field.description}
              items={(getValue(value, field.path) as string[]) ?? []}
              onChange={(next) => updatePath(field.path, next)}
              itemLabel={field.itemLabel}
              mode="strings"
              placeholder={field.placeholder}
            />
          );
        }

        if (field.type === "object-list") {
          return (
            <RepeaterField
              key={field.path}
              label={field.label}
              description={field.description}
              items={(getValue(value, field.path) as Record<string, string>[]) ?? []}
              onChange={(next) => updatePath(field.path, next)}
              itemLabel={field.itemLabel}
              mode="objects"
              fields={field.fields}
            />
          );
        }

        if (field.type === "media") {
          return (
            <FieldGroup key={field.path} title={field.label} description={field.description}>
              <MediaPicker
                label={field.label}
                value={(getValue(value, field.path) as string) ?? ""}
                category={field.category}
                suggestedPath={field.suggestedPath}
                onChange={(next) => updatePath(field.path, next)}
              />
            </FieldGroup>
          );
        }

        if (field.type === "richtext") {
          return (
            <FieldGroup key={field.path} title={field.label} description={field.description}>
              <RichTextEditor
                value={(getValue(value, field.path) as string) ?? ""}
                onChange={(next) => updatePath(field.path, next)}
                placeholder={field.placeholder}
              />
            </FieldGroup>
          );
        }

        if (field.type === "select") {
          const current = getValue(value, field.path);
          return (
            <FieldGroup key={field.path} title={field.label} description={field.description}>
              <label className="grid gap-2 text-sm text-slate">
                <span>{field.label}</span>
                <select
                  value={String(current ?? "")}
                  onChange={(event) => {
                    const option = field.options.find((item) => String(item.value) === event.target.value);
                    if (option) updatePath(field.path, option.value);
                  }}
                  className="min-w-0 max-w-full rounded-[1.2rem] border border-ink/10 bg-[#fcfaf7] px-4 py-3 text-base text-ink outline-none transition focus-visible:border-ink/30 focus-visible:ring-2 focus-visible:ring-bronze/30"
                >
                  {field.options.map((option) => <option key={String(option.value)} value={String(option.value)}>{option.label}</option>)}
                </select>
              </label>
            </FieldGroup>
          );
        }

        if (field.type === "toggle") {
          const checked = getValue(value, field.path) === true;
          return (
            <FieldGroup key={field.path} title={field.label} description={field.description}>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[1.2rem] border border-ink/10 bg-[#fcfaf7] px-4 py-3 text-sm text-slate focus-within:ring-2 focus-within:ring-bronze/30">
                <span>{checked ? "已開啟" : "已關閉"}</span>
                <input type="checkbox" checked={checked} onChange={(event) => updatePath(field.path, event.target.checked)} className="h-5 w-5 accent-ink" />
              </label>
            </FieldGroup>
          );
        }

        const multiline = field.type === "textarea";
        const Element = multiline ? "textarea" : "input";

        return (
          <FieldGroup key={field.path} title={field.label} description={field.description}>
            <label className="grid gap-2 text-sm text-slate">
              <span>{field.label}</span>
              <Element
                value={(getValue(value, field.path) as string) ?? ""}
                onChange={(event) => updatePath(field.path, event.target.value)}
                placeholder={field.placeholder}
                rows={multiline ? 6 : undefined}
                className="rounded-[1.4rem] border border-ink/10 bg-[#fcfaf7] px-4 py-3 text-base text-ink outline-none transition focus:border-ink/25 focus:bg-white"
              />
            </label>
          </FieldGroup>
        );
  };

  const activeGroups = fieldGroups ?? [{ title: "設定", fields }];

  return (
    <div className="grid gap-5">
      {activeGroups.map((group) => (
        <section key={group.title} className="grid gap-4 rounded-[2rem] border border-ink/8 bg-white/55 p-4 md:p-5">
          <div>
            <h2 className="text-xl font-medium text-ink">{group.title}</h2>
            {group.description ? <p className="mt-1 text-sm text-slate">{group.description}</p> : null}
          </div>
          {group.fields.map(renderField)}
        </section>
      ))}

      <SaveBar
        status={status}
        error={error}
        onSave={async () => {
          setStatus("saving");
          setError("");

          try {
            if (onSaveAsync) {
              await onSaveAsync(value);
            } else {
              const response = await fetch(`/api/admin/content/${section}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(value)
              });

              const result = (await response.json()) as { error?: string };
              if (!response.ok) {
                throw new Error(result.error || "儲存失敗");
              }
            }
            setStatus("saved");
            onSaved?.(value);
          } catch (e: unknown) {
            setStatus("error");
            setError(e instanceof Error ? e.message : "儲存失敗");
          }
        }}
      />
    </div>
  );
}
