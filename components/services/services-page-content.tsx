import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AnswerBlocks } from "@/components/ui/answer-blocks";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import {
  JsonLd,
  createBreadcrumbSchema,
  createFaqSchema,
  createServiceSchema
} from "@/lib/seo";

const answerBlocks = [
  {
    question: "OFFICE NEXT 的服務在做什麼？",
    answer:
      "我們把 ChatGPT 工作應用、GAS 辦公降載、Agent 協作與白領工作流程整理成可執行的課程、內訓與導入方案，讓 AI 真的進入日常辦公。"
  },
  {
    question: "怎麼判斷自己需要哪一種服務？",
    answer:
      "如果你想先改善個人輸出，適合從提示詞工坊開始；如果你想降低表單、試算表與信件重工，適合從 GAS 辦公降載開始；如果是團隊導入，適合企業 AI 內訓。"
  }
];

const serviceSections = [
  {
    id: "service-ai-strategy",
    name: "GPT 智慧工作模組－提示詞工坊",
    description:
      "從會議紀錄、提案摘要、資料整理、文案修稿到報表說明，協助白領建立可重複使用的 ChatGPT 工作模板。",
    serviceType: "ChatGPT Workflow Training",
    audience: "行政、企劃、行銷、業務、PM、人資",
    bestFor: "適合想把 ChatGPT 從靈感工具變成日常工作協作員的白領工作者。",
    outcomes: [
      "可重複使用的白領工作提示詞與文件模板",
      "會議紀錄、資料整理、提案摘要的固定流程",
      "更穩定的輸出格式與人工檢查節點"
    ],
    scenarios: [
      "每天都有大量會議紀錄、文字整理與資料摘要要處理。",
      "知道 ChatGPT 有用，但每次都從空白對話開始。",
      "你想先用半自動方法降低重複文書工作。"
    ]
  },
  {
    id: "service-brand-design",
    name: "GPT 智慧工作模組－GAS 辦公降載",
    description:
      "用 Google Apps Script 串接表單、試算表、文件與信件，把高重複、規則明確的辦公流程逐步半自動化。",
    serviceType: "Office Automation Training",
    audience: "需要處理表單、試算表、信件通知與例行彙整的團隊",
    bestFor: "適合想把複製貼上、名單整理、信件通知與報表更新降載的個人與團隊。",
    outcomes: [
      "可維護的表單、試算表與信件半自動流程",
      "更少人工複製貼上與漏欄位風險",
      "能交接的流程說明與檢查方式"
    ],
    scenarios: [
      "表單回覆後需要人工整理資料與寄信。",
      "試算表每週都要重複清理、標記與彙整。",
      "你想先從低風險流程開始導入辦公自動化。"
    ]
  },
  {
    id: "service-enterprise-enablement",
    name: "企業 AI 內訓與辦公流程導入",
    description:
      "以真實白領工作情境設計企業內訓、工作坊與導入節奏，讓管理者與團隊建立 AI 協作語言、工作標準與實作能力。",
    serviceType: "Corporate AI Training",
    audience: "企業管理者、知識工作團隊",
    bestFor: "適合需要跨部門導入 AI、建立組織共同語言與訓練節奏的企業。",
    outcomes: [
      "更一致的 AI 使用原則與內部溝通語言",
      "面向真實工作場景的訓練內容與實作模組",
      "讓導入不只停留在口號，而能進入日常工作的組織能力"
    ],
    scenarios: [
      "企業已經在談 AI，但各部門對導入期待完全不同。",
      "內訓不能只是展示工具，你需要真正貼近工作情境的內容。",
      "你想把 AI 變成組織能力，而不是短期專案。"
    ]
  }
];

const selectorItems = [
  {
    href: "#service-ai-strategy",
    label: "提示詞工坊",
    note: "先建立 ChatGPT 工作模板"
  },
  {
    href: "#service-brand-design",
    label: "GAS 辦公降載",
    note: "先降低表格與信件重工"
  },
  {
    href: "#service-enterprise-enablement",
    label: "企業合作與內訓",
    note: "先建立共同語言與落地能力"
  }
];

const decisionGuide = [
  {
    title: "如果你最需要的是釐清方向",
    recommendation: "先從 GPT 提示詞工坊開始",
    description:
      "當你還在盤點問題、優先序與導入範圍時，顧問比工作坊更適合，因為它能先建立判斷框架。"
  },
  {
    title: "如果你最需要的是降低重複行政",
    recommendation: "先從 GAS 辦公降載開始",
    description:
      "當你的表單、試算表、通知與彙整一直靠人工處理時，先建立半自動流程會比硬撐更有效。"
  },
  {
    title: "如果你最需要的是讓團隊真的上手",
    recommendation: "先從企業合作與內訓開始",
    description:
      "當管理者已經知道方向，但執行層仍缺少共同語言與工作方法時，訓練與工作坊更適合作為起點。"
  }
];

const faqs = [
  {
    question: "Services 頁主要提供哪些服務？",
    answer:
      "這一頁主要介紹 GPT 提示詞工坊、GAS 辦公降載、Agent 高效槓桿，以及企業 AI 內訓與辦公流程導入。"
  },
  {
    question: "如果我不知道該選顧問還是內訓，怎麼辦？",
    answer:
      "通常可先看你目前最急迫的是方向定義、品牌內容整理，還是團隊實作能力建立。這頁的 decision guide 就是為了協助這個判斷。"
  },
  {
    question: "所有服務內容都能被搜尋引擎與 AI 讀取嗎？",
    answer:
      "可以。所有主要服務文案、適合對象、你會得到什麼與常見情境都已直接輸出在 HTML 中，互動只是輔助導覽。"
  }
];

const subnavItems = [
  { href: "#services-overview", label: "服務總覽" },
  { href: "#services-selector", label: "服務導覽" },
  { href: "#service-ai-strategy", label: "提示詞工坊" },
  { href: "#service-brand-design", label: "GAS 辦公降載" },
  { href: "#service-enterprise-enablement", label: "企業 AI 內訓" },
  { href: "#services-decision-guide", label: "選擇指南" },
  { href: "#services-faq", label: "FAQ" }
];

export function ServicesPageContent() {
  return (
    <>
      <JsonLd
        data={[
          createBreadcrumbSchema([
            { name: "首頁", path: "/" },
            { name: "服務項目", path: "/services" }
          ]),
          createFaqSchema(faqs),
          ...serviceSections.map((service) =>
            createServiceSchema({
              name: service.name,
              description: service.description,
              path: "/services",
              serviceType: service.serviceType,
              audience: service.audience
            })
          )
        ]}
      />

      <section className="relative overflow-hidden border-b border-ink/6 bg-[#f6f1e9] pb-16 pt-20 md:pb-20 md:pt-28 lg:pb-24 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.74),transparent_38%)]" />
        <div className="absolute inset-y-0 right-0 w-[46%] bg-[radial-gradient(circle_at_center,rgba(131,104,74,0.08),transparent_62%)]" />
        <div className="absolute inset-0 bg-hero-grid bg-[size:72px_72px] opacity-[0.05]" />
        <Container className="relative grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="max-w-[760px]">
            <p className="text-[11px] uppercase tracking-[0.34em] text-bronze">Services</p>
            <h1 className="mt-5 max-w-[11ch] text-balance text-[2.9rem] font-medium leading-[1.06] text-ink md:text-[4.8rem] lg:text-[5.4rem]">
              ChatGPT、GAS 與企業 AI 內訓
            </h1>
            <p className="mt-7 max-w-[43rem] text-[1.04rem] text-slate md:text-[1.16rem]">
              OFFICE NEXT 的服務不是把工具一個個堆給你，而是幫你整理成能長期運作的管理方法。這一頁直接說明每項服務適合誰、會得到什麼，以及在哪些情境下最值得開始。
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/contact">預約顧問需求討論</ButtonLink>
              <ButtonLink href="/corporate-training" variant="secondary">
                查看企業內訓方案
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[2.4rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,242,233,0.92))] p-7 shadow-[0_28px_70px_rgba(17,17,17,0.08)] backdrop-blur-sm md:p-9">
            <p className="text-[11px] uppercase tracking-[0.3em] text-bronze">Quick Answers</p>
            <div className="mt-6">
              <AnswerBlocks items={answerBlocks} />
            </div>
          </div>
        </Container>
      </section>

      <div className="sticky top-[78px] z-40 border-b border-ink/6 bg-paper/82 backdrop-blur-xl">
        <Container className="overflow-x-auto">
          <nav aria-label="Services 頁內導覽" className="flex min-w-max gap-3 py-4">
            {subnavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-ink/8 bg-white/70 px-4 py-2 text-sm text-slate transition hover:border-ink/16 hover:bg-white hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      <Section id="services-overview" className="scroll-mt-36">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionTitle
            eyebrow="Core Services"
            title="三個核心方向，對應三種不同需求"
            description="這不是 SaaS pricing page，而是協助你理解不同合作方式該在什麼階段介入。"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {serviceSections.map((service) => (
              <article
                key={service.id}
                className="rounded-[2.2rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,241,233,0.96))] p-6 shadow-[0_22px_60px_rgba(17,17,17,0.06)] transition duration-300 hover:-translate-y-1 hover:border-ink/14 hover:shadow-[0_28px_72px_rgba(17,17,17,0.1)]"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">{service.audience}</p>
                <h2 className="mt-5 text-[1.35rem] font-medium leading-8 text-ink">{service.name}</h2>
                <p className="mt-4 text-base text-slate">{service.description}</p>
                <a href={`#${service.id}`} className="mt-6 inline-block text-sm text-ink transition hover:text-slate">
                  跳到這項服務的完整說明
                </a>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section id="services-selector" surface="muted" className="scroll-mt-36">
        <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
          <SectionTitle
            eyebrow="Service Selector"
            title="用服務導覽 selector 快速定位最適合的方向"
            description="這裡像 tabs，但實際上是可爬的錨點導覽。所有內容都已先 render，只是幫助使用者更快定位。"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {selectorItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-[1.9rem] border border-ink/8 bg-white/78 px-5 py-5 shadow-[0_16px_44px_rgba(17,17,17,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-ink/14 hover:bg-white hover:shadow-[0_24px_60px_rgba(17,17,17,0.08)]"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Selector</p>
                <h3 className="mt-4 text-[1.18rem] font-medium leading-8 text-ink">{item.label}</h3>
                <p className="mt-3 text-sm text-slate">{item.note}</p>
              </a>
            ))}
          </div>
        </div>
      </Section>

      {serviceSections.map((service) => (
        <Section key={service.id} id={service.id} className="scroll-mt-36">
          <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
            <SectionTitle
              eyebrow="Service Detail"
              title={service.name}
              description={service.description}
            />
            <div className="grid gap-5">
              <div className="rounded-[2.5rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,233,0.98))] p-7 shadow-[0_24px_64px_rgba(17,17,17,0.06)]">
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">適合對象</p>
                    <p className="mt-4 text-base text-slate">{service.bestFor}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">你會得到什麼</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {service.outcomes.map((item) => (
                        <div
                          key={item}
                          className="rounded-[1.5rem] border border-ink/8 bg-white/70 px-4 py-4 text-sm text-slate"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-7 border-t border-ink/8 pt-6">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">常見情境</p>
                  <div className="mt-4 grid gap-3">
                    {service.scenarios.map((scenario, index) => (
                      <div
                        key={scenario}
                        className="flex items-start gap-4 rounded-[1.5rem] border border-ink/8 bg-white/72 px-4 py-4"
                      >
                        <span className="font-serif text-2xl italic leading-none text-bronze">0{index + 1}</span>
                        <p className="text-base text-slate">{scenario}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      ))}

      <Section id="services-decision-guide" surface="muted" className="scroll-mt-36">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <SectionTitle
            eyebrow="Decision Guide"
            title="怎麼選適合自己的服務"
            description="這個區塊像互動式 decision guide，但每個判斷選項與答案都先存在 HTML，只是以可掃讀的模組化方式呈現。"
          />
          <div className="grid gap-5">
            {decisionGuide.map((item) => (
              <article
                key={item.title}
                className="group rounded-[2.3rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,233,0.98))] p-7 shadow-[0_22px_58px_rgba(17,17,17,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-ink/14 hover:shadow-[0_28px_70px_rgba(17,17,17,0.08)]"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">{item.title}</p>
                <h3 className="mt-4 text-[1.35rem] font-medium leading-8 text-ink">{item.recommendation}</h3>
                <p className="mt-4 text-base text-slate">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section id="services-faq" className="scroll-mt-36 pb-24 pt-8 md:pt-10">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <SectionTitle
            eyebrow="FAQ"
            title="服務相關常見問題"
            description="FAQ 採用高級 accordion，但所有答案一開始就存在頁面 HTML 中，互動只改善閱讀體驗。"
          />
          <FaqAccordion items={faqs} firstOpen />
        </div>
      </Section>
    </>
  );
}
