import { ButtonLink } from "../ui/button";
import { Card } from "../ui/card";
import { Section } from "../ui/section";
import { SectionTitle } from "../ui/section-title";

const insights = [
  "AI 導入真正的分水嶺，不是工具知道多少，而是團隊是否重寫了工作分工。",
  "當每個人都在用 AI，真正的競爭力來自組織是否建立了更穩定的工作標準。",
  "白領提效的下一步，不是更忙地做更多事，而是重新定義哪些工作本來就不該由人親自完成。"
];

export function InsightsSection() {
  return (
    <Section>
      <SectionTitle
        eyebrow="Perspective"
        title="不是追逐 AI 話題，而是建立更成熟的工作觀點。"
        description="OFFICE NEXT 將 AI 放回商務現場來理解，持續關注白領工作流程如何被重新整理，以及企業與個人應如何建立新的效率判斷。"
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {insights.map((item, index) => (
          <Card key={item} className="flex min-h-[280px] flex-col justify-between">
            <p className="font-serif text-3xl italic leading-tight text-bronze">0{index + 1}</p>
            <p className="mt-12 text-[1.35rem] leading-10 text-ink">{item}</p>
          </Card>
        ))}
      </div>
      <div className="mt-10">
        <ButtonLink href="/about" variant="secondary">
          了解品牌觀點
        </ButtonLink>
      </div>
    </Section>
  );
}
