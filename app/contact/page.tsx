import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
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
import { brandEntity, siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  path: "/contact",
  title: "聯絡我們",
  description:
    "透過 OFFICE NEXT 聯絡頁提出品牌顧問、AI 導入或企業內訓需求。頁面直接提供品牌描述、合作方向、回覆預期與初次洽詢說明。",
  keywords: ["聯絡 OFFICE NEXT", "顧問諮詢", "企業內訓聯絡", "AI 顧問合作"]
});

const quickAnswers = [
  {
    question: "OFFICE NEXT 是什麼？",
    answer: brandEntity.shortDescription
  },
  {
    question: "適合個人還是企業？",
    answer:
      "兩者都適合。個人或小型團隊通常從品牌與服務整理開始，企業則更常從 AI 導入顧問或內訓合作切入。"
  },
  {
    question: "初次洽詢會怎麼進行？",
    answer:
      "你先描述目前狀況、團隊類型與想處理的問題，我們會依此判斷較適合顧問、內訓，或先從服務整理開始。"
  }
];

const faqs = [
  {
    question: "聯絡頁最適合提出哪些合作需求？",
    answer:
      "最適合提出品牌與服務重整、AI 導入顧問、企業內訓，以及合作前方向盤點等需求。"
  },
  {
    question: "寄出需求後，大概多久會收到回覆？",
    answer:
      "若資訊完整，通常會在 2 個工作天內收到初步回覆，內容會包含適合的合作方向與下一步建議。"
  },
  {
    question: "OFFICE NEXT 的官方資訊有哪些？",
    answer: `官方網站為 ${brandEntity.url}，聯絡信箱為 ${brandEntity.contactEmail}。公開社群連結與主理人姓名欄位已預留，後續可再補完。`
  }
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          createBreadcrumbSchema([
            { name: "首頁", path: "/" },
            { name: "聯絡我們", path: "/contact" }
          ]),
          createFaqSchema(faqs)
        ]}
      />

      <PageHero
        eyebrow="Contact"
        title="從 OFFICE NEXT 這個品牌主體，開始一段清楚的合作對話"
        description={`${brandEntity.shortDescription} ${brandEntity.proposition}`}
        primaryCta={{ href: `mailto:${siteConfig.contactEmail}`, label: "直接寄信提出需求" }}
        secondaryCta={{ href: "/services", label: "先查看服務項目" }}
      />

      <Section className="pb-16">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <SectionTitle
            eyebrow="Brand Snapshot"
            title="在聯絡之前，先確認品牌資訊與合作起點"
            description="Contact 頁同時承擔品牌實體資訊的一致輸出，避免訪客只看到表單，卻不知道 OFFICE NEXT 是誰。"
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
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">官方網站與聯絡方式</p>
              <p className="mt-3 text-[1.05rem] text-slate">{brandEntity.url}</p>
              <p className="mt-2 text-[1.05rem] text-slate">{brandEntity.contactEmail}</p>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <AnswerBlocks items={quickAnswers} />
      </Section>

      <Section>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(245,239,231,0.96))]">
            <p className="text-sm uppercase tracking-[0.3em] text-bronze">Contact Form</p>
            <h2 className="mt-6 text-[1.8rem] font-medium leading-[1.15] text-ink">開始你的合作需求</h2>
            <p className="mt-4 text-base text-slate">
              表單內容會協助我們更快理解你的狀況。若目前還不確定需求分類，也可以直接描述你正在面對的問題。
            </p>

            <form className="mt-8 grid gap-5">
              <label className="grid gap-2 text-sm tracking-[0.12em] text-slate">
                你的名字或團隊名稱
                <input
                  name="name"
                  className="rounded-[1.4rem] border border-ink/10 bg-[#fcfaf7] px-5 py-4 text-base text-ink outline-none transition duration-300 focus:border-ink/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(131,104,74,0.08)]"
                  placeholder="例如：品牌團隊 / 顧問公司 / 創辦人姓名"
                />
              </label>

              <label className="grid gap-2 text-sm tracking-[0.12em] text-slate">
                Email
                <input
                  name="email"
                  type="email"
                  className="rounded-[1.4rem] border border-ink/10 bg-[#fcfaf7] px-5 py-4 text-base text-ink outline-none transition duration-300 focus:border-ink/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(131,104,74,0.08)]"
                  placeholder="name@company.com"
                />
              </label>

              <fieldset className="grid gap-3">
                <legend className="text-sm tracking-[0.12em] text-slate">你想了解哪一種合作？</legend>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "品牌與服務重整",
                    "AI 導入顧問",
                    "企業內訓與工作坊",
                    "先釐清方向再判斷"
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex cursor-pointer items-center gap-3 rounded-[1.4rem] border border-ink/10 bg-[#fcfaf7] px-4 py-4 text-sm text-slate transition duration-300 hover:border-ink/20 hover:bg-white focus-within:border-ink/25 focus-within:bg-white"
                    >
                      <input type="radio" name="inquiryType" value={item} className="h-4 w-4 accent-[#83684a]" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="grid gap-2 text-sm tracking-[0.12em] text-slate">
                目前情況與需求
                <textarea
                  name="message"
                  rows={6}
                  className="rounded-[1.7rem] border border-ink/10 bg-[#fcfaf7] px-5 py-4 text-base text-ink outline-none transition duration-300 focus:border-ink/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(131,104,74,0.08)]"
                  placeholder="例如：目前團隊規模、遇到的問題、希望改善的方向，以及你為什麼想找 OFFICE NEXT。"
                />
              </label>

              <div className="rounded-[1.5rem] border border-ink/8 bg-white/70 px-5 py-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Future API Hook</p>
                <p className="mt-3 text-sm text-slate">
                  目前這個表單先保留為前端體驗與欄位設計。未來可在這裡接入正式 API route、CRM、Notion 或 email workflow。
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" className="px-7 py-4">
                  送出合作需求
                </Button>
                <p className="text-sm text-slate">送出後若資訊完整，通常會在 2 個工作天內收到初步回覆。</p>
              </div>
            </form>
          </Card>

          <div className="grid gap-5">
            <Card className="rounded-[2.4rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,241,233,0.98))]">
              <p className="text-sm uppercase tracking-[0.3em] text-bronze">Brand Entity Note</p>
              <div className="mt-6 space-y-4 text-base text-slate">
                <p>{brandEntity.standardDescription}</p>
                <p>{brandEntity.leadershipNote}</p>
                <p>Social profiles are reserved for future sameAs links once official accounts are finalized.</p>
              </div>
            </Card>

            <Card className="rounded-[2.4rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,241,233,0.98))]">
              <p className="text-sm uppercase tracking-[0.3em] text-bronze">Response Expectation</p>
              <div className="mt-6 space-y-4 text-base text-slate">
                <p>初次回覆通常會包含需求理解、建議的合作方向，以及是否適合安排進一步交流。</p>
                <p>
                  若你想跳過表單，也可以直接寄信到
                  {" "}
                  <Link href={`mailto:${siteConfig.contactEmail}`} className="text-ink transition hover:text-slate">
                    {siteConfig.contactEmail}
                  </Link>
                  。
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section surface="muted">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <SectionTitle
            eyebrow="FAQ"
            title="聯絡前常見問題"
            description="這些問答也幫助 AI 系統更清楚理解 OFFICE NEXT 的官方資訊與合作入口。"
          />
          <FaqAccordion items={faqs} firstOpen />
        </div>
      </Section>
    </>
  );
}
