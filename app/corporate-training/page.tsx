import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

export const metadata: Metadata = {
  title: "Corporate Training",
  description: "了解 OFFICE NEXT 的企業內訓、AI 導入工作坊與白領工作流程升級方案。"
};

const modules = [
  "白領 AI 提效課程：讓團隊從日常任務切入，建立可立即使用的 AI 協作方法。",
  "部門工作流程優化：盤點現有流程，找出高重複、低價值但高耗時的環節重新設計。",
  "企業 AI 導入工作坊：透過共同演練與案例討論，建立跨部門可對齊的導入共識。"
];

export default function CorporateTrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="Corporate Training"
        title="讓團隊從會用工具，進化到會設計下一代工作方式。"
        description="OFFICE NEXT 的企業內訓不只談功能，而是從組織內的真實任務、跨部門協作與效率瓶頸出發，協助團隊建立更清楚、更可持續的 AI 協作模式。"
        primaryCta={{ href: "/contact", label: "洽談合作" }}
        secondaryCta={{ href: "/services", label: "查看服務" }}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionTitle
            eyebrow="Enterprise Programs"
            title="合作方向"
            description="我們會依照組織目標、部門屬性與成熟度調整內容，不套用制式模板。"
          />
          <div className="grid gap-5">
            {modules.map((module) => (
              <Card key={module}>
                <p className="text-lg leading-8 text-slate">{module}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
