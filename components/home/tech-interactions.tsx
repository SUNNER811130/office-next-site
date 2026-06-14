import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type TechGridProps = HTMLAttributes<HTMLDivElement> & {
  intensity?: "soft" | "strong";
};

export function TechGrid({ className, intensity = "soft", ...props }: TechGridProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 bg-hero-grid bg-[size:58px_58px]",
        intensity === "soft" ? "opacity-[0.13]" : "opacity-[0.22]",
        className
      )}
      {...props}
    />
  );
}

export function DataStream({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} {...props}>
      <span className="data-stream-line left-[14%] top-0 h-full" />
      <span className="data-stream-line left-[48%] top-0 h-full [animation-delay:1.1s]" />
      <span className="data-stream-line left-[78%] top-0 h-full [animation-delay:2.2s]" />
      <span className="data-stream-pulse left-[22%] top-[18%] [animation-delay:.4s]" />
      <span className="data-stream-pulse left-[64%] top-[42%] [animation-delay:1.5s]" />
      <span className="data-stream-pulse left-[38%] top-[72%] [animation-delay:2.4s]" />
    </div>
  );
}

type GlowCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function GlowCard({ children, className, ...props }: GlowCardProps) {
  return (
    <div
      className={cn(
        "glow-card group relative overflow-hidden rounded-2xl border border-white/70 bg-white/72 p-7 shadow-glass backdrop-blur-xl transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-glass-hover md:p-8",
        className
      )}
      {...props}
    >
      <span aria-hidden="true" className="glow-card-sheen" />
      {children}
    </div>
  );
}

type ProcessRailItem = {
  label: string;
  title: string;
  description: string;
};

export function ProcessRail({ items, className }: { items: ProcessRailItem[]; className?: string }) {
  return (
    <div className={cn("relative grid gap-5 lg:grid-cols-3", className)}>
      <div aria-hidden="true" className="absolute left-6 right-6 top-10 hidden h-px bg-[linear-gradient(90deg,rgba(110,167,191,0),rgba(110,167,191,0.55),rgba(110,167,191,0))] lg:block" />
      {items.map((item, index) => (
        <GlowCard key={item.title} className="relative min-h-[260px]">
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/35 bg-champagne/10 text-sm font-medium text-midnight">
                {index + 1}
              </span>
              <span className="rounded-full border border-midnight/10 bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-slate">
                {item.label}
              </span>
            </div>
            <h3 className="mt-7 text-[1.35rem] font-medium text-midnight">{item.title}</h3>
            <p className="mt-4 text-base text-slate">{item.description}</p>
          </div>
        </GlowCard>
      ))}
    </div>
  );
}

export function ScrollSignal({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("hidden items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-slate/70 md:flex", className)}>
      <span className="relative h-8 w-[1px] overflow-hidden bg-midnight/10">
        <span className="scroll-signal-line absolute left-0 top-0 h-3 w-full bg-champagne" />
      </span>
      Scroll
    </div>
  );
}

export function WorkflowConsole({ className }: { className?: string }) {
  const nodes = [
    { label: "Prompt", value: "會議 / 提案 / 報表", status: "整理輸入" },
    { label: "GAS", value: "表單 / 試算表 / 信件", status: "例行降載" },
    { label: "Agent", value: "追蹤 / 彙整 / 檢查", status: "協作執行" }
  ];

  return (
    <div className={cn("relative", className)}>
      <div aria-hidden="true" className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_50%_20%,rgba(110,167,191,0.34),transparent_56%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#071A2F]/92 p-4 shadow-[0_28px_80px_rgba(7,26,47,0.22)] backdrop-blur-xl md:rounded-[2.5rem] md:p-5">
        <TechGrid intensity="strong" className="opacity-[0.14]" />
        <DataStream className="opacity-70" />
        <div className="relative z-10 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-champagne">AI Work Cockpit</p>
              <h2 className="mt-2 text-xl font-medium text-white md:text-2xl">工作流中控艙</h2>
            </div>
            <span className="rounded-full border border-champagne/35 bg-champagne/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-champagne">
              Live
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            {nodes.map((node, index) => (
              <div key={node.label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <div aria-hidden="true" className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-champagne/70" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-champagne">0{index + 1} / {node.label}</p>
                    <p className="mt-2 text-sm leading-6 text-white">{node.value}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] tracking-[0.16em] text-white/72">
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {["重複事務", "流程節點", "準時下班"].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Signal 0{index + 1}</p>
                <p className="mt-2 text-sm font-medium text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
