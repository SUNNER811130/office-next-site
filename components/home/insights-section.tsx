import { ButtonLink } from "../ui/button";
import { Card } from "../ui/card";
import { Section } from "../ui/section";
import { SectionTitle } from "../ui/section-title";

const insights = [
  "不是你效率差，是你一直在做 AI 能接手的事。",
  "很多人學 AI 之後還是很忙，問題不在工具，而在做事方式。",
  "未來白領真正的差距，不只是能力差距，而是工作設計能力差距。"
];

export function InsightsSection() {
  return (
    <Section>
      <SectionTitle
        eyebrow="Perspective"
        title="觀點，不只來自工具，而是來自工作現場"
        description="OFFICE NEXT 持續分享白領 AI 提效、辦公自動化與工作流程升級相關內容，幫助更多人用更輕盈的方法，面對日常工作的複雜與重複。"
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {insights.map((item) => (
          <Card key={item} className="flex min-h-64 flex-col justify-between">
            <p className="font-serif text-3xl italic leading-tight text-bronze">Essay</p>
            <p className="mt-10 text-xl leading-9 text-ink">{item}</p>
          </Card>
        ))}
      </div>
      <div className="mt-10">
        <ButtonLink href="/about" variant="secondary">
          閱讀更多觀點
        </ButtonLink>
      </div>
    </Section>
  );
}
