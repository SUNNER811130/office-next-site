import { Section } from "../ui/section";

export function WhySection() {
  return (
    <Section surface="muted">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-ink/10 bg-white/85 p-8 shadow-soft md:p-12">
        <p className="text-xs uppercase tracking-[0.32em] text-bronze">Why We Started</p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 text-base leading-8 text-slate md:text-lg">
            <p>
              現在很多白領真正疲憊的，不是高難度挑戰，而是每天被大量零碎、反覆、低價值但又不得不做的工作綁住。
            </p>
            <p>
              會議記錄、資料整理、提案摘要、報表彙整、文字修稿、流程追蹤、跨部門溝通每一件看起來都不大，卻不斷消耗專注力、判斷力與創造力。
            </p>
            <p>
              OFFICE NEXT 相信，真正的辦公進化，不是把人逼得更忙，而是讓人把時間留給更值得被人完成的事。
            </p>
          </div>
          <blockquote className="flex items-end rounded-[2rem] bg-ink px-8 py-10 text-2xl leading-relaxed text-paper md:text-3xl">
            不是所有工作都該由人重複完成。
          </blockquote>
        </div>
      </div>
    </Section>
  );
}
