"use client";

import { useState } from "react";

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

export type SectionField = SimpleField | MediaField | StringRepeaterField | ObjectRepeaterField;

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
  onSaveAsync
}: {
  section: string;
  initialValue: T;
  fields: SectionField[];
  onSaveAsync?: (value: T) => Promise<void>;
}) {
  const [value, setValueState] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const updatePath = (path: string, next: unknown) => {
    setValueState((current) => setValue(current, path, next));
    setStatus("idle");
  };

  return (
    <div className="grid gap-5">
      {fields.map((field) => {
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
      })}

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
          } catch (e: any) {
            setStatus("error");
            setError(e.message || "儲存失敗");
          }
        }}
      />
    </div>
  );
}
