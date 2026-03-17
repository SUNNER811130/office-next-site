import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(250,246,240,0.92))] p-7 shadow-[0_22px_55px_rgba(17,17,17,0.07)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-ink/12 hover:shadow-[0_28px_65px_rgba(17,17,17,0.1)] md:p-8",
        className
      )}
      {...props}
    />
  );
}
