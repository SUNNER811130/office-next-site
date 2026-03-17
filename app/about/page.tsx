import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

export const metadata: Metadata = {
  title: "About",
  description: "了解 OFFICE NEXT 辦公進化所的品牌理念、工作觀點與辦公進化主張。"
};

const values = [
  {
    title: "從工作現場出發",
    description:
      "我們關注的是會議、提案、彙整、追蹤、協作這些每天都真的會發生的事，而不是停留在工具展示。"
  },
  {
    title: "先有方法，再談工具",
    description:
      "工具會更新，但好的工作設計可以被延續。OFFICE NEXT 重視的是可複製、可落地的 AI 協作方式。"
  },
  {
    title: "讓白領更有餘裕",
    description:
      "真正的效率不是塞進更多任務，而是讓時間回到判斷、溝通、策略與創造這些更值得人完成的工作。"
  }
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="我們不是在教人追新工具，而是在幫人重做工作方式。"
        description="OFFICE NEXT 辦公進化所，專注白領 AI 提效、自動化與工作流程升級。我們相信，當 AI 真正被接進工作流程，效率提升只是結果，更重要的是工作秩序、專注力與價值感也會一起被重新找回。"
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <SectionTitle
            eyebrow="Brand Belief"
            title="辦公進化，不是更忙，而是更有設計感地工作。"
            description="很多人開始接觸 AI 後，依然覺得忙，原因通常不是工具不夠強，而是工作仍然沿用舊的方法在運轉。"
          />
          <div className="space-y-6 text-base leading-8 text-slate md:text-lg">
            <p>
              OFFICE NEXT 想做的，是把白領工作裡最常見、最反覆、最容易耗掉精力的環節重新拆解，再找到適合由 AI 協作的節點。
            </p>
            <p>
              我們相信未來白領的差距，不只來自能力差距，而是來自工作設計能力差距。誰能更早建立清楚、有效率、可持續的 AI 協作方式，誰就更有機會把時間留給真正重要的事。
            </p>
          </div>
        </div>
      </Section>
      <Section surface="muted">
        <SectionTitle eyebrow="Values" title="OFFICE NEXT 的三個核心價值" align="center" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title}>
              <h2 className="text-2xl font-medium text-ink">{value.title}</h2>
              <p className="mt-5 text-base leading-8 text-slate">{value.description}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
