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
        "pointer-events-none absolute inset-0 bg-hero-grid bg-[size:50px_50px]",
        intensity === "soft" ? "opacity-[0.18]" : "opacity-[0.34]",
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
      <span className="data-stream-line left-[88%] top-0 h-full [animation-delay:.7s]" />
      <span className="data-stream-pulse left-[22%] top-[18%] [animation-delay:.4s]" />
      <span className="data-stream-pulse left-[64%] top-[42%] [animation-delay:1.5s]" />
      <span className="data-stream-pulse left-[38%] top-[72%] [animation-delay:2.4s]" />
      <span className="data-packet left-[10%] top-[32%]" />
      <span className="data-packet left-[54%] top-[64%] [animation-delay:1.8s]" />
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
        "glow-card group relative overflow-hidden rounded-2xl border border-white/70 bg-white/76 p-7 shadow-glass backdrop-blur-xl transition-all duration-500 motion-safe:hover:-translate-y-2 motion-safe:hover:rotate-[0.25deg] motion-safe:hover:shadow-[0_22px_58px_rgba(7,26,47,0.12),0_0_0_1px_rgba(110,167,191,0.18)] md:p-8",
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
      <div aria-hidden="true" className="signal-line absolute left-6 right-6 top-10 hidden h-px overflow-hidden bg-[linear-gradient(90deg,rgba(110,167,191,0),rgba(110,167,191,0.42),rgba(110,167,191,0))] lg:block" />
      {items.map((item, index) => (
        <GlowCard key={item.title} className="relative min-h-[282px]">
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center justify-between gap-4">
              <span className="orbit-node inline-flex h-12 w-12 items-center justify-center rounded-full border border-champagne/45 bg-champagne/12 text-sm font-medium text-midnight shadow-[0_0_28px_rgba(110,167,191,0.2)]">
                {index + 1}
              </span>
              <span className="rounded-full border border-midnight/10 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-slate">
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
      <div aria-hidden="true" className="absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle_at_50%_18%,rgba(110,167,191,0.46),transparent_48%),radial-gradient(circle_at_78%_72%,rgba(7,26,47,0.3),transparent_42%)] blur-2xl" />
      <div className="console-frame relative overflow-hidden rounded-[2rem] border border-champagne/32 bg-[#051526] p-4 shadow-[0_32px_92px_rgba(7,26,47,0.38),0_0_0_1px_rgba(110,167,191,0.18),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl md:rounded-[2.5rem] md:p-5">
        <TechGrid intensity="strong" className="opacity-[0.24]" />
        <DataStream className="opacity-95" />
        <div aria-hidden="true" className="console-scanline absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(130,205,229,0.14),transparent)]" />
        <div className="relative z-10 rounded-[1.5rem] border border-champagne/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.055))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] md:p-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/14 pb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#9fd4e8]">AI Work Cockpit</p>
              <h2 className="mt-2 text-xl font-medium text-white drop-shadow-[0_0_18px_rgba(159,212,232,0.28)] md:text-2xl">工作流中控艙</h2>
            </div>
            <span className="live-badge rounded-full border border-champagne/55 bg-champagne/15 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#B9E5F3] shadow-[0_0_24px_rgba(110,167,191,0.22)]">
              Live
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            {nodes.map((node, index) => (
              <div key={node.label} className="console-node relative overflow-hidden rounded-2xl border border-champagne/22 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(110,167,191,0.07))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                <div aria-hidden="true" className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-[#A7DDEF] shadow-[0_0_18px_rgba(110,167,191,0.7)]" />
                <span aria-hidden="true" className="node-pulse absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-[#A7DDEF] shadow-[0_0_22px_rgba(110,167,191,0.8)]" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-[#A7DDEF]">0{index + 1} / {node.label}</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-white">{node.value}</p>
                  </div>
                  <span className="rounded-full border border-white/14 bg-white/12 px-3 py-1 text-[10px] tracking-[0.16em] text-white">
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {["重複事務", "流程節點", "準時下班"].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/14 bg-white/[0.09] px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#A7DDEF]/75">Signal 0{index + 1}</p>
                <p className="mt-2 text-sm font-medium text-white">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-champagne/18 bg-[#061B30]/80 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#A7DDEF]">System Load</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/78">Ready</p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <span className="h-1.5 rounded-full bg-[#A7DDEF]" />
              <span className="h-1.5 rounded-full bg-[#7DBBD1]" />
              <span className="h-1.5 rounded-full bg-white/24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
