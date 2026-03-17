import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-ink/10 bg-white/85 p-7 shadow-soft backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-ink/20",
        className
      )}
      {...props}
    />
  );
}
