import { ButtonLink } from "../ui/button";
import { Section } from "../ui/section";

export function FinalCtaSection() {
  return (
    <Section className="pb-24 pt-8 md:pb-28">
      <div className="rounded-[2.8rem] border border-white/10 bg-[linear-gradient(135deg,#111111_0%,#1c1c1c_100%)] px-8 py-12 text-paper shadow-[0_34px_90px_rgba(17,17,17,0.18)] md:px-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#d7c5ab]">Start A Better Workflow</p>
            <h2 className="mt-5 max-w-[11ch] text-balance text-[2.2rem] font-medium leading-[1.14] md:text-[4rem]">
              準備好讓團隊工作方式，正式升級到 AI 協作階段。
            </h2>
            <p className="mt-6 max-w-[38rem] text-[1rem] leading-8 text-[#e6dfd5] md:text-[1.05rem]">
              無論你要規劃個人效率升級、GPT 工作模組，或企業內訓導入，OFFICE NEXT 都能協助你把 AI 從工具使用，推進為真正可執行的工作流程。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <ButtonLink href="/contact" className="bg-paper text-ink hover:bg-white">
              預約顧問諮詢
            </ButtonLink>
            <ButtonLink
              href="/services"
              variant="secondary"
              className="border-white/16 bg-white/6 text-paper hover:bg-white/12 hover:text-paper"
            >
              查看服務方案
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
