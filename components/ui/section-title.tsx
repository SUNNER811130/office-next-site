import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SectionTitleProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
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
        "max-w-3xl space-y-5",
        align === "center" && "mx-auto text-center",
        className
      )}
      {...props}
    >
      {eyebrow ? (
        <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-champagne">{eyebrow}</p>
      ) : null}
      <h2 className="max-w-[16ch] text-balance text-[2rem] font-medium leading-[1.18] text-midnight md:text-[3.35rem]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-[38rem] text-pretty text-[1rem] leading-8 text-slate md:text-[1.075rem]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
