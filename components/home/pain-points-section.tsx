import { Card } from "../ui/card";
import { Section } from "../ui/section";
import { SectionTitle } from "../ui/section-title";

const painPoints = [
  "每天忙於整理資料、摘要資訊、撰寫回覆與例行報表，時間被大量低價值重複工作吃掉。",
  "知道 ChatGPT 或各種 AI 工具有幫助，但無法串成穩定工作流程，只能零碎使用。",
  "團隊內每個人各自摸索，缺少一致的方法與標準，無法真正放大效率成果。",
  "想導入 AI，卻擔心流程混亂、輸出品質不穩，最後反而增加溝通與管理成本。"
];

export function PainPointsSection() {
  return (
    <Section className="pt-18 md:pt-24">
      <SectionTitle
        eyebrow="Pain Points"
        title="真正拖慢工作效率的，往往不是能力，而是流程。"
        description="當重複工作持續堆疊，團隊即使很努力，也很難把時間投入在真正重要的判斷與決策。OFFICE NEXT 針對的正是這類白領工作現場。"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {painPoints.map((item, index) => (
          <Card key={item} className="flex min-h-[240px] flex-col justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-bronze">
              Pain 0{index + 1}
            </span>
            <p className="mt-10 max-w-[24rem] text-[1.2rem] leading-9 text-ink">{item}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
