import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SectionTitleProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionTitle({
  className,
  eyebrow,
  title,
  description,
  align = "left",
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" && "mx-auto text-center",
        className
      )}
      {...props}
    >
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-bronze">{eyebrow}</p>
      ) : null}
      <h2 className="text-balance text-3xl font-medium leading-tight text-ink md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-pretty text-base leading-8 text-slate md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
