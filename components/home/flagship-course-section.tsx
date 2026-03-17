import { ButtonLink } from "../ui/button";
import { Card } from "../ui/card";
import { Section } from "../ui/section";
import { SectionTitle } from "../ui/section-title";

const audience = [
  "想提升效率的白領工作者",
  "想把 GPT 用進日常工作的主管與團隊成員",
  "想理解 AI 實際應用而非停留在表面操作的人"
];

export function FlagshipCourseSection() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SectionTitle
            eyebrow="Flagship Program"
            title="旗艦課程｜GPT 智慧工作模組"
            description="這不是一堂只教你問問題的 AI 課，而是一套幫白領把 GPT 真正用進工作裡的方法課。"
          />
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate md:text-lg">
            從資訊整理、提案架構、文案優化、會議彙整，到日常工作流程中的半自動協作，你會學到的不是炫技，而是能立刻派上用場的工作升級方式。
          </p>
          <ButtonLink href="/services" className="mt-8">
            查看課程內容
          </ButtonLink>
        </div>
        <Card className="bg-[#f6f2eb] p-9">
          <p className="text-sm uppercase tracking-[0.28em] text-bronze">適合對象</p>
          <div className="mt-8 space-y-6">
            {audience.map((item) => (
              <div key={item} className="border-b border-ink/8 pb-6 last:border-none last:pb-0">
                <p className="text-lg leading-8 text-slate">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}
