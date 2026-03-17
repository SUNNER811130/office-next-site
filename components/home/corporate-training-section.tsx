import { ButtonLink } from "../ui/button";
import { Card } from "../ui/card";
import { Section } from "../ui/section";
import { SectionTitle } from "../ui/section-title";

const directions = [
  "主管視角的 AI 導入策略與任務分工",
  "第一線同仁可立刻使用的 AI 工作流程模組",
  "企業內部可推行的標準化做法與落地節奏"
];

export function CorporateTrainingSection() {
  return (
    <Section surface="muted">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.96fr] lg:items-start">
        <div className="space-y-6">
          <SectionTitle
            eyebrow="Corporate Training"
            title="企業內訓，不只教工具，更整理團隊的新工作秩序。"
            description="當 AI 進入組織，真正需要被設計的是分工、標準與執行方式。OFFICE NEXT 協助企業把學習轉成可推動的工作升級方案。"
          />
          <p className="max-w-[38rem] text-[1rem] text-slate md:text-[1.05rem]">
            我們以白領團隊實際面對的工作型態為基礎，設計可導入、可溝通、可落地的內訓內容。重點不在於單一工具熟悉度，而在於組織如何建立更成熟的 AI 協作節奏。
          </p>
          <ButtonLink href="/corporate-training">查看企業內訓方案</ButtonLink>
        </div>
        <Card className="bg-ink text-paper">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#d7c5ab]">Training Focus</p>
          <div className="mt-8 space-y-5">
            {directions.map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-5">
                <p className="text-lg leading-8">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}
