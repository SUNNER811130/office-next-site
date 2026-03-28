import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/70 p-7 shadow-glass backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-hover md:p-8",
        className
      )}
      {...props}
    />
  );
}
