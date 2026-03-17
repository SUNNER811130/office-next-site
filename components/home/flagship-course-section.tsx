import { ButtonLink } from "../ui/button";
import { Card } from "../ui/card";
import { Section } from "../ui/section";
import { SectionTitle } from "../ui/section-title";

const audience = [
  "希望把 GPT 真的用進日常工作，而不是只停留在靈感與試玩階段的白領工作者。",
  "需要建立可複製工作模組，讓團隊成員能有一致 AI 使用邏輯的主管與核心成員。",
  "想提升報表、簡報、溝通、整理與企劃效率，卻不想走炫技路線的專業工作者。"
];

export function FlagshipCourseSection() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
        <div>
          <SectionTitle
            eyebrow="Flagship Program"
            title="GPT 智慧工作模組，重新整理白領的日常效率結構。"
            description="以真實工作場景為核心，從任務拆解、提示結構到輸出品質控制，協助學員建立一套可長期使用的 AI 工作模組。"
          />
          <p className="mt-6 max-w-[38rem] text-[1rem] text-slate md:text-[1.05rem]">
            這不是單純的工具教學，而是工作方法訓練。內容聚焦在白領最常見的文書、整理、表達與協作任務，幫助學員把 AI 真正變成穩定、可信任的工作協作員。
          </p>
          <ButtonLink href="/services" className="mt-8">
            了解課程設計
          </ButtonLink>
        </div>
        <Card className="bg-[linear-gradient(180deg,rgba(247,241,233,0.94),rgba(242,233,220,0.95))] p-9">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Who It Fits</p>
          <div className="mt-8 space-y-6">
            {audience.map((item) => (
              <div key={item} className="border-b border-ink/8 pb-6 last:border-none last:pb-0">
                <p className="text-lg text-ink">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}
