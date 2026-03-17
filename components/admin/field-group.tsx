import type { ReactNode } from "react";

type FieldGroupProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FieldGroup({ title, description, children }: FieldGroupProps) {
  return (
    <section className="rounded-[2rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(246,240,232,0.95))] p-5 shadow-[0_20px_60px_rgba(17,17,17,0.04)] md:p-6">
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">{title}</p>
        {description ? <p className="mt-2 max-w-3xl text-sm text-slate">{description}</p> : null}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}
