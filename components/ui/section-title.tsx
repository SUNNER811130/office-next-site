import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SectionTitleProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  headingLevel?: "h1" | "h2";
};

export function SectionTitle({
  className,
  eyebrow,
  title,
  description,
  align = "left",
  headingLevel = "h2",
  ...props
}: SectionTitleProps) {
  const Heading = headingLevel;

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
      <Heading className="site-section-title max-w-[18ch] text-balance font-medium leading-[1.12] text-midnight">
        {title}
      </Heading>
      {description ? (
        <div className="max-w-[42rem] text-pretty text-[0.95rem] leading-7 text-slate md:text-[1.05rem] md:leading-8">
          {description}
        </div>
      ) : null}
    </div>
  );
}
