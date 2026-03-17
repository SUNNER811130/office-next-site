import { ButtonLink } from "../ui/button";
import { Container } from "../ui/container";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-ink/8 bg-paper">
      <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[#ebe4d8] lg:block" />
      <div className="absolute right-[10%] top-24 hidden h-72 w-72 rounded-full bg-white/80 blur-3xl lg:block" />
      <div className="absolute inset-0 bg-hero-grid bg-[size:60px_60px] opacity-20" />
      <Container className="relative grid gap-16 py-24 md:py-32 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.34em] text-bronze">Office Next Brand Site</p>
          <h1 className="mt-6 max-w-4xl text-balance text-5xl font-medium leading-[1.08] text-ink md:text-7xl">
            讓 AI 成為你的工作協作員
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-slate md:text-xl">
            OFFICE NEXT 辦公進化所，專注白領 AI 提效、自動化與工作流程升級，幫助個人與團隊把重複工作交給 AI，把時間留給更有價值的事。
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/services">了解服務</ButtonLink>
            <ButtonLink href="/corporate-training" variant="secondary">
              企業合作洽詢
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm tracking-[0.18em] text-slate">
            不是學 AI 炫技，而是學會更聰明地工作。
          </p>
        </div>
        <div className="rounded-[2.5rem] border border-ink/10 bg-white/85 p-8 shadow-soft backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.26em] text-bronze">Work Upgrade Thesis</p>
          <div className="mt-10 space-y-8">
            {[
              "把重複性的資訊整理交給 AI，保留判斷。",
              "把流程重新拆解後導入協作，而不是只學一個工具。",
              "讓團隊建立可以被複製的下一代工作方式。"
            ].map((item, index) => (
              <div key={item} className="flex gap-4">
                <span className="pt-1 font-serif text-2xl italic text-bronze">0{index + 1}</span>
                <p className="text-base leading-8 text-slate">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
