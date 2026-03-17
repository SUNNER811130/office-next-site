import { ButtonLink } from "../ui/button";
import { Container } from "../ui/container";

const focusPoints = [
  "把常見行政、報表與資料整理工作，轉成可被 AI 接手的標準流程。",
  "讓個人會用工具，進一步升級為團隊能複製、能落地的工作方法。",
  "以商務語境重新整理 AI 應用，不做炫技，只做真正可採用的效率設計。"
];

const signalMetrics = [
  { label: "面向對象", value: "白領工作者與團隊主管" },
  { label: "合作主題", value: "AI 提效 / 自動化 / 流程升級" },
  { label: "工作風格", value: "務實導入，重視可執行與可複製" }
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-ink/6 bg-paper">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(131,104,74,0.06))]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(17,17,17,0.12),transparent)]" />
      <div className="absolute inset-0 bg-hero-grid bg-[size:72px_72px] opacity-[0.08]" />
      <Container className="relative grid gap-12 py-20 md:py-28 lg:min-h-[calc(100vh-78px)] lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-24">
        <div className="max-w-[720px]">
          <p className="text-[11px] uppercase tracking-[0.36em] text-bronze">
            OFFICE NEXT 辦公進化所
          </p>
          <h1 className="mt-6 max-w-[11ch] text-balance text-[3.4rem] font-medium leading-[1.02] text-ink md:text-[5.5rem] lg:text-[6.2rem]">
            讓 AI 成為你的工作協作員
          </h1>
          <p className="mt-7 max-w-[40rem] text-pretty text-[1.05rem] text-slate md:text-[1.2rem]">
            專注白領 AI 提效、自動化與工作流程升級，協助個人與團隊把重複工作交給 AI，把時間留給判斷、溝通與更有價值的決策。
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/services">查看服務方案</ButtonLink>
            <ButtonLink href="/corporate-training" variant="secondary">
              了解企業內訓
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-4 border-t border-ink/8 pt-6 sm:grid-cols-3">
            {signalMetrics.map((item) => (
              <div key={item.label} className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">{item.label}</p>
                <p className="text-sm leading-7 text-slate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.75rem] bg-[#e6ddd0] md:translate-x-5 md:translate-y-5" />
          <div className="relative rounded-[2.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,241,233,0.96))] p-7 shadow-[0_28px_80px_rgba(17,17,17,0.09)] md:p-9">
            <div className="flex items-center justify-between border-b border-ink/8 pb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-bronze">Brand Perspective</p>
                <p className="mt-2 text-xl font-medium text-ink md:text-2xl">成熟商務團隊的 AI 工作樣貌</p>
              </div>
              <span className="rounded-full border border-ink/10 px-3 py-1 text-[11px] tracking-[0.18em] text-slate">
                STRATEGY
              </span>
            </div>
            <div className="mt-7 space-y-5">
              {focusPoints.map((item, index) => (
                <div
                  key={item}
                  className="grid gap-3 rounded-[1.6rem] border border-ink/8 bg-white/65 px-5 py-5 md:grid-cols-[56px_1fr] md:items-start"
                >
                  <span className="font-serif text-3xl italic leading-none text-bronze">
                    0{index + 1}
                  </span>
                  <p className="text-base text-slate">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-[1.8rem] border border-ink/8 bg-[#f5efe6] px-5 py-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">OFFICE NEXT Thesis</p>
              <p className="mt-3 text-base text-ink md:text-lg">
                AI 不該只是新工具，而是下一代白領工作流程的協作層。
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
