import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { AnswerBlocks } from "@/components/ui/answer-blocks";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Card } from "@/components/ui/card";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import {
  JsonLd,
  createBreadcrumbSchema,
  createFaqSchema,
  createPageMetadata,
  createServiceSchema
} from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/corporate-training",
  title: "企業 AI 內訓｜白領提效與辦公流程導入",
  description:
    "OFFICE NEXT 提供企業 AI 內訓，聚焦白領 AI 提效、ChatGPT 工作應用、GAS 辦公降載、辦公自動化與團隊 AI 協作流程導入。",
  keywords: ["企業 AI 內訓", "白領 AI 提效", "ChatGPT 工作應用", "GAS 辦公降載", "辦公自動化", "AI 工作流程"]
});

const answerBlocks = [
  {
    question: "企業為什麼現在要導入 AI 協作？",
    answer:
      "因為白領工作的差距已經不只在工具使用，而在誰能更早建立共同語言、流程標準、資料邊界與品質控制方法。"
  },
  {
    question: "企業內訓能解決哪些問題？",
    answer:
      "它能協助團隊找出會議紀錄、資料整理、提案摘要、報表彙整與表單通知等可降載場景，讓管理者與執行者的期待一致。"
  }
];

const modules = [
  {
    title: "管理者 AI 導入框架",
    description: "協助主管辨識適合導入的白領工作場景、資料安全邊界、授權原則與流程檢查點。"
  },
  {
    title: "ChatGPT 白領工作流程實作",
    description: "從會議紀錄、提案摘要、資料整理、報表說明到內部協作，直接對應團隊每天會遇到的工作。"
  },
  {
    title: "GAS 與 Agent 辦公降載場景",
    description: "把表單、試算表、信件與追蹤任務整理成半自動化流程，再評估是否升級為 Agent 協作。"
  }
];

const faqs = [
  {
    question: "企業內訓適合什麼類型的團隊？",
    answer:
      "適合行政、行銷、業務、PM、人資、營運、客服、主管與任何需要大量文件、資料、會議與跨部門協作的白領團隊。"
  },
  {
    question: "內訓內容會只停留在工具介紹嗎？",
    answer:
      "不會。OFFICE NEXT 的企業內訓會結合管理情境、ChatGPT 工作應用、流程拆解、文件方法與實作任務，讓訓練後能真的落地。"
  },
  {
    question: "不會寫程式的團隊也適合參與嗎？",
    answer:
      "適合。課程設計以白領工作情境為核心，重點在協作、文件與決策，而不是程式開發技能。"
  }
];

export default function CorporateTrainingPage() {
  return (
    <>
      <JsonLd
        data={[
          createBreadcrumbSchema([
            { name: "首頁", path: "/" },
            { name: "企業內訓", path: "/corporate-training" }
          ]),
          createFaqSchema(faqs),
          createServiceSchema({
            name: "AI 企業內訓",
            description:
              "提供管理者與白領團隊的 AI 企業內訓，聚焦 ChatGPT 工作應用、GAS 辦公降載、辦公自動化與團隊 AI 協作流程。",
            path: "/corporate-training",
            serviceType: "Corporate AI Training",
            audience: "企業管理者與白領團隊"
          })
        ]}
      />

      <PageHero
        eyebrow="Corporate Training"
        title="讓企業 AI 內訓真的回到白領工作流程"
        description="OFFICE NEXT 的企業 AI 內訓面向管理者與白領團隊設計，幫助組織建立 ChatGPT 工作應用、辦公自動化、GAS 辦公降載與 AI 協作流程。這不是一場工具展示，而是一個可延續的工作升級起點。"
        primaryCta={{ href: "/contact", label: "預約企業內訓討論" }}
        secondaryCta={{ href: "/services", label: "先查看課程與服務" }}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <FadeUp>
            <SectionTitle
              eyebrow="Answer Blocks"
              title="企業需要的不是多認識一個工具，而是建立可共用的 AI 工作方法"
              description="內訓內容會直接對應團隊日常場景，讓搜尋引擎與 AI 摘錄也能理解 OFFICE NEXT 的導入重點。"
            />
          </FadeUp>
          <FadeUp delay={0.15}>
            <AnswerBlocks items={answerBlocks} />
          </FadeUp>
        </div>
      </Section>

      <Section surface="muted">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <FadeUp>
            <SectionTitle
              eyebrow="Training Modules"
              title="常見內訓模組"
              description="課程內容會依照企業角色與成熟度調整，但通常圍繞以下三個方向。"
            />
          </FadeUp>
          <StaggerContainer className="grid gap-5">
            {modules.map((module) => (
              <StaggerItem key={module.title}>
                <Card>
                  <h2 className="text-[1.35rem] font-medium leading-8 text-midnight">{module.title}</h2>
                  <p className="mt-4 text-base text-slate">{module.description}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <FadeUp>
            <SectionTitle
              eyebrow="FAQ"
              title="企業內訓常見問題"
              description="以下回答以可引用、可理解的格式說明企業 AI 內訓合作方式。"
            />
          </FadeUp>
          <FadeUp delay={0.15}>
            <FaqAccordion items={faqs} firstOpen />
          </FadeUp>
        </div>
        <div className="mt-12">
          <ButtonLink href="/contact">前往聯絡頁安排企業內訓討論</ButtonLink>
        </div>
      </Section>
    </>
  );
}
