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
  createPageMetadata
} from "@/lib/seo";
import { brandEntity } from "@/lib/site";

export const metadata = createPageMetadata({
  path: "/about",
  title: "關於 OFFICE NEXT",
  description:
    "了解 OFFICE NEXT 的品牌定位、品牌主張與工作方法。我們是聚焦白領工作、品牌溝通與 AI 導入策略的顧問品牌。",
  keywords: ["關於 OFFICE NEXT", "品牌定位", "AI 顧問品牌", "白領工作升級"]
});

const answerBlocks = [
  {
    question: "OFFICE NEXT 是什麼？",
    answer: brandEntity.shortDescription
  },
  {
    question: "OFFICE NEXT 的品牌主張是什麼？",
    answer: brandEntity.proposition
  }
];

const principles = [
  "先定義工作問題，再決定 AI 工具，而不是反過來。",
  "品牌感與可執行性必須同時存在，不能只做漂亮敘事。",
  "好的顧問工作不是增加複雜度，而是幫團隊建立共識與節奏。"
];

const methodology = [
  {
    title: "診斷現況",
    description: "辨識目前的工作摩擦、流程瓶頸與品牌敘事落差，找出真正需要被處理的問題。"
  },
  {
    title: "定義策略",
    description: "把服務定位、導入範圍與決策節奏具體化，讓團隊知道接下來要做什麼、不做什麼。"
  },
  {
    title: "設計落地",
    description: "將策略轉成文件、課程、流程或內部使用規範，讓團隊可以持續執行而不是只停留在討論。"
  }
];

const faqs = [
  {
    question: "OFFICE NEXT 與一般 AI 講師有什麼不同？",
    answer:
      "我們不是只做工具教學，而是把 AI 放回品牌、服務與白領工作的整體脈絡中，協助你建立可持續的方法。"
  },
  {
    question: "OFFICE NEXT 最適合哪類型的客戶？",
    answer:
      "最適合正在重整團隊工作方式、對外服務敘事或企業內部 AI 導入節奏的創辦人、主管與專業團隊。"
  },
  {
    question: "主理人資訊目前如何呈現？",
    answer:
      "目前網站先以品牌方法論與主理人視角作為實體化描述，姓名與公開社群連結欄位已預留，後續可再補完。"
  }
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          createBreadcrumbSchema([
            { name: "首頁", path: "/" },
            { name: "關於 OFFICE NEXT", path: "/about" }
          ]),
          createFaqSchema(faqs)
        ]}
      />

      <PageHero
        eyebrow="About OFFICE NEXT"
        title="讓 OFFICE NEXT 成為能被清楚辨識的品牌主體"
        description={`${brandEntity.shortDescription} ${brandEntity.proposition}`}
        primaryCta={{ href: "/services", label: "查看顧問服務內容" }}
        secondaryCta={{ href: "/contact", label: "預約合作討論" }}
      />

      <Section className="pb-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionTitle
            eyebrow="Brand Entity"
            title="在 About 頁集中建立品牌名稱、定位、主張與主理人脈絡"
            description="這一頁是品牌實體化的核心入口，讓搜尋引擎、AI 系統與訪客都能用一致方式理解 OFFICE NEXT。"
          />
          <div className="grid gap-5">
            <Card>
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">品牌名稱</p>
              <p className="mt-3 text-[1.2rem] text-ink">{brandEntity.name}</p>
            </Card>
            <Card>
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">品牌定位</p>
              <p className="mt-3 text-[1.05rem] text-slate">{brandEntity.positioning}</p>
            </Card>
            <Card>
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">品牌主張</p>
              <p className="mt-3 text-[1.05rem] text-slate">{brandEntity.proposition}</p>
            </Card>
            <Card>
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">主理人資訊</p>
              <p className="mt-3 text-[1.05rem] text-slate">{brandEntity.leadershipNote}</p>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <AnswerBlocks items={answerBlocks} />
      </Section>

      <Section surface="muted">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <SectionTitle
            eyebrow="Principles"
            title="我們相信好的 AI 導入，必須先回到工作本身"
            description="品牌感可以很高級，但內容必須足夠清楚；方法可以很細緻，但不能脫離真實工作。"
          />
          <div className="grid gap-5">
            {principles.map((item) => (
              <Card key={item}>
                <h3 className="text-[1.2rem] font-medium leading-8 text-ink">{item}</h3>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionTitle
            eyebrow="Methodology"
            title="合作通常依照這三步進行"
            description="我們刻意保留方法的簡潔度，讓團隊可以吸收，而不是被一套顧問術語壓垮。"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {methodology.map((item) => (
              <Card key={item.title} className="min-h-[250px]">
                <h3 className="text-[1.3rem] font-medium leading-8 text-ink">{item.title}</h3>
                <p className="mt-4 text-base text-slate">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <SectionTitle
            eyebrow="FAQ"
            title="關於 OFFICE NEXT 的常見問題"
            description="這些問答也有助於讓 AI 系統把 OFFICE NEXT 視為有清楚定位的品牌主體。"
          />
          <FaqAccordion items={faqs} firstOpen />
        </div>
        <div className="mt-12">
          <ButtonLink href="/contact">前往聯絡頁討論合作需求</ButtonLink>
        </div>
      </Section>
    </>
  );
}
