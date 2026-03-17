import { Card } from "../ui/card";
import { Section } from "../ui/section";
import { SectionTitle } from "../ui/section-title";

const painPoints = [
  "會議紀錄、資料彙整、摘要重寫，一做再做，花很多時間卻很難累積真正價值。",
  "你可能試過 ChatGPT，但它還只是偶爾幫忙，沒有真正成為工作的一部分。",
  "你希望工作更省力、更穩定，但不想一開始就被技術門檻嚇退。",
  "知道 AI 很重要，卻不知道該從個人應用、團隊協作還是流程優化先下手。"
];

export function PainPointsSection() {
  return (
    <Section>
      <SectionTitle
        eyebrow="Pain Points"
        title="你忙的，很多其實不該一直由你親手重做"
        description="如果你每天都在以下情境裡反覆消耗，OFFICE NEXT 會很適合你。"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {painPoints.map((item, index) => (
          <Card key={item} className="flex min-h-52 flex-col justify-between">
            <span className="text-sm font-medium uppercase tracking-[0.22em] text-bronze">
              0{index + 1}
            </span>
            <p className="mt-10 text-lg leading-8 text-slate">{item}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
