"use client";

import { FieldGroup } from "@/components/admin/field-group";

export type RepeaterSubField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "image";
  placeholder?: string;
};

type RepeaterFieldProps =
  | {
      label: string;
      description?: string;
      items: string[];
      onChange: (next: string[]) => void;
      itemLabel: string;
      mode: "strings";
      placeholder?: string;
    }
  | {
      label: string;
      description?: string;
      items: Record<string, string>[];
      onChange: (next: Record<string, string>[]) => void;
      itemLabel: string;
      mode: "objects";
      fields: RepeaterSubField[];
    };

function baseInputClasses(multiline?: boolean) {
  return multiline
    ? "min-h-[120px] rounded-[1.4rem] border border-ink/10 bg-[#fcfaf7] px-4 py-3 text-base text-ink outline-none transition focus:border-ink/25 focus:bg-white"
    : "rounded-[1.4rem] border border-ink/10 bg-[#fcfaf7] px-4 py-3 text-base text-ink outline-none transition focus:border-ink/25 focus:bg-white";
}

export function RepeaterField(props: RepeaterFieldProps) {
  const removeAt = (index: number) => {
    props.onChange(props.items.filter((_, itemIndex) => itemIndex !== index) as never);
  };

  const addItem = () => {
    if (props.mode === "strings") {
      props.onChange([...props.items, ""]);
      return;
    }

    const empty = Object.fromEntries(props.fields.map((field) => [field.name, ""]));
    props.onChange([...props.items, empty]);
  };

  return (
    <FieldGroup title={props.label} description={props.description}>
      <div className="grid gap-4">
        {props.items.map((item, index) => (
          <div key={`${props.itemLabel}-${index}`} className="rounded-[1.6rem] border border-ink/8 bg-white/75 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink">
                {props.itemLabel} {index + 1}
              </p>
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="rounded-full border border-ink/10 px-3 py-1 text-xs tracking-[0.18em] text-slate transition hover:border-ink/20 hover:text-ink"
              >
                刪除
              </button>
            </div>

            {props.mode === "strings" ? (
              <textarea
                value={item as string}
                onChange={(event) => {
                  const next = [...(props.items as string[])];
                  next[index] = event.target.value;
                  props.onChange(next);
                }}
                placeholder={props.placeholder}
                className={baseInputClasses(true)}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {props.fields.map((field) => {
                  const multiline = field.type === "textarea";
                  const currentItem = item as Record<string, string>;
                  const value = currentItem[field.name] ?? "";
                  const Element = multiline ? "textarea" : "input";
                  return (
                    <label key={field.name} className="grid gap-2 text-sm text-slate">
                      <span>{field.label}</span>
                      <Element
                        value={value}
                        onChange={(event) => {
                          const next = [...(props.items as Record<string, string>[])];
                          next[index] = {
                            ...next[index],
                            [field.name]: event.target.value
                          };
                          props.onChange(next);
                        }}
                        placeholder={field.placeholder}
                        rows={multiline ? 4 : undefined}
                        className={baseInputClasses(multiline)}
                      />
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="inline-flex w-fit items-center justify-center rounded-full border border-ink/10 bg-white px-4 py-2 text-sm tracking-[0.14em] text-ink transition hover:border-ink/20"
      >
        新增{props.itemLabel}
      </button>
    </FieldGroup>
  );
}
