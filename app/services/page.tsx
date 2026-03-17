import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

export const metadata: Metadata = {
  title: "Services",
  description: "查看 OFFICE NEXT 的旗艦課程、顧問型服務與白領 AI 工作升級方案。"
};

const offerings = [
  {
    title: "GPT 智慧工作模組",
    description:
      "以白領日常任務為核心，建立從提問、整理、彙整到半自動協作的完整工作方法。"
  },
  {
    title: "工作流程優化顧問",
    description:
      "針對個人或團隊的既有流程盤點任務節點，找出可以被 AI 接手、加速或輔助判斷的部分。"
  },
  {
    title: "AI 協作導入工作坊",
    description:
      "透過實際情境演練與案例拆解，幫助團隊理解如何讓 AI 真正成為工作協作的一部分。"
  }
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="不是多上一堂 AI 課，而是把工作方式真正升級。"
        description="OFFICE NEXT 服務聚焦白領工作中的高頻場景，從個人提效到團隊導入，協助你建立更穩定、更實用、更可複製的 AI 協作流程。"
        primaryCta={{ href: "/contact", label: "立即洽詢" }}
      />
      <Section>
        <SectionTitle
          eyebrow="Programs"
          title="服務與課程"
          description="每一項服務都以真實工作流程為出發點，避免只有工具展示、沒有方法落地。"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {offerings.map((offering) => (
            <Card key={offering.title} className="min-h-72">
              <h2 className="text-2xl font-medium text-ink">{offering.title}</h2>
              <p className="mt-5 text-base leading-8 text-slate">{offering.description}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
