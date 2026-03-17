import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { AnswerBlocks } from "@/components/ui/answer-blocks";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Card } from "@/components/ui/card";
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
  title: "企業內訓",
  description:
    "OFFICE NEXT 提供面向管理者與白領團隊的 AI 企業內訓，內容聚焦真實工作流程、文件方法與跨部門協作，而非只做工具展示。",
  keywords: ["企業內訓", "AI 內訓", "白領培訓", "企業工作流程"]
});

const answerBlocks = [
  {
    question: "企業為什麼現在要導入 AI 協作？",
    answer:
      "因為差距已經不只在工具使用，而在誰能更早建立共識、標準、流程與品質控制方法。"
  },
  {
    question: "企業內訓能解決哪些問題？",
    answer:
      "它能幫助團隊建立共同語言、辨識可導入場景、降低導入焦慮，並讓管理者與執行者的期待更一致。"
  }
];

const modules = [
  {
    title: "管理者 AI 決策框架",
    description: "協助主管辨識適合導入的場景、風險與授權邊界，建立清楚的管理原則。"
  },
  {
    title: "白領工作流程實作",
    description: "從文件整理、提案撰寫、研究摘要到內部協作，直接對應團隊日常工作。"
  },
  {
    title: "品牌與內容團隊應用",
    description: "讓品牌、行銷與內容團隊學會如何在維持品質的前提下使用 AI，而不是犧牲品牌感。"
  }
];

const faqs = [
  {
    question: "企業內訓適合什麼類型的團隊？",
    answer:
      "適合管理者、顧問型團隊、品牌行銷部門與任何需要大量知識工作協作的白領型組織。"
  },
  {
    question: "內訓內容會只停留在工具介紹嗎？",
    answer:
      "不會。OFFICE NEXT 的企業內訓會結合管理情境、工作流程與文件方法，讓訓練後能真的落地。"
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
              "提供管理者與白領團隊的 AI 企業內訓，聚焦真實工作流程、內部共識與高品質應用。",
            path: "/corporate-training",
            serviceType: "Corporate AI Training",
            audience: "企業管理者與白領團隊"
          })
        ]}
      />

      <PageHero
        eyebrow="Corporate Training"
        title="讓企業內訓真正改變工作方法，而不只是跟上話題"
        description="OFFICE NEXT 的企業內訓面向管理者與白領團隊設計，幫助組織建立 AI 共識、流程標準與實際工作方法。這不是一場展示，而是一個可延續的訓練起點。"
        primaryCta={{ href: "/contact", label: "預約企業內訓討論" }}
        secondaryCta={{ href: "/services", label: "先查看顧問服務" }}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionTitle
            eyebrow="Answer Blocks"
            title="用短而準的答案說明企業內訓的必要性"
            description="這些段落會直接出現在首輪 HTML，便於 AI 與搜尋引擎擷取。"
          />
          <AnswerBlocks items={answerBlocks} />
        </div>
      </Section>

      <Section surface="muted">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <SectionTitle
            eyebrow="Training Modules"
            title="常見內訓模組"
            description="課程內容會依照企業角色與成熟度調整，但通常圍繞以下三個方向。"
          />
          <div className="grid gap-5">
            {modules.map((module) => (
              <Card key={module.title}>
                <h2 className="text-[1.35rem] font-medium leading-8 text-ink">{module.title}</h2>
                <p className="mt-4 text-base text-slate">{module.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <SectionTitle
            eyebrow="FAQ"
            title="企業內訓常見問題"
            description="互動採用原生 accordion，答案不依賴 client-only 載入。"
          />
          <FaqAccordion items={faqs} firstOpen />
        </div>
        <div className="mt-12">
          <ButtonLink href="/contact">前往聯絡頁安排企業內訓討論</ButtonLink>
        </div>
      </Section>
    </>
  );
}
