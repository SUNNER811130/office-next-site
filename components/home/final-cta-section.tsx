import { ButtonLink } from "../ui/button";
import { Section } from "../ui/section";

export function FinalCtaSection() {
  return (
    <Section className="pb-28 pt-10">
      <div className="rounded-[2.5rem] bg-[#111111] px-8 py-12 text-paper shadow-soft md:px-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d4c2a8]">Start Now</p>
            <h2 className="mt-5 max-w-3xl text-balance text-3xl font-medium leading-tight md:text-5xl">
              把重複工作交給 AI，把價值留給自己
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#e4ddd4] md:text-lg">
              如果你希望讓個人工作更有效率，或想為團隊建立更成熟的 AI 協作方式，OFFICE NEXT 可以陪你一起開始。
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <ButtonLink href="/contact" className="bg-paper text-ink hover:bg-white">
              立即洽詢
            </ButtonLink>
            <ButtonLink
              href="/services"
              variant="secondary"
              className="border-white/20 bg-white/5 text-paper hover:bg-white/10 hover:text-paper"
            >
              查看服務
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
