import { ButtonLink } from "../ui/button";
import { Card } from "../ui/card";
import { Section } from "../ui/section";
import { SectionTitle } from "../ui/section-title";

const directions = ["白領 AI 提效課程", "部門工作流程優化", "企業 AI 導入工作坊"];

export function CorporateTrainingSection() {
  return (
    <Section surface="muted">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <SectionTitle
            eyebrow="Corporate Training"
            title="為團隊建立下一代的工作方式"
            description="當 AI 開始進入職場，真正重要的不是誰先知道最新工具，而是誰能更快把工作方式升級。"
          />
          <p className="max-w-2xl text-base leading-8 text-slate md:text-lg">
            OFFICE NEXT 提供企業內訓與合作方案，協助組織從白領工作場景出發，建立更清楚、更有效率、更能持續複製的 AI 協作模式。
          </p>
          <ButtonLink href="/corporate-training">洽談企業合作</ButtonLink>
        </div>
        <Card className="bg-ink text-paper">
          <p className="text-sm uppercase tracking-[0.28em] text-[#d4c2a8]">合作方向</p>
          <div className="mt-8 space-y-5">
            {directions.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 px-5 py-5">
                <p className="text-lg leading-8">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}
