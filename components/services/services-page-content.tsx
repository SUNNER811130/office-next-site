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
      "我們把 AI 導入、品牌敘事與白領工作流程整理成可執行的顧問與訓練方案，讓團隊不只知道工具，而是真的知道怎麼工作。"
  },
  {
    question: "怎麼判斷自己需要哪一種服務？",
    answer:
      "如果你需要先定義方向，適合從顧問開始；如果你需要讓團隊實際改變工作方式，適合從工作坊或企業內訓切入。"
  }
];

const serviceSections = [
  {
    id: "service-ai-strategy",
    name: "AI 策略顧問",
    description:
      "從目標、流程、角色分工到管理邊界，協助企業建立真正可執行的 AI 使用策略，而不是只收集一份工具名單。",
    serviceType: "AI Strategy Consulting",
    audience: "管理者、創辦人、顧問型團隊",
    bestFor: "適合正在盤點導入方向、建立 AI 判斷框架與優先序的組織。",
    outcomes: [
      "更清楚的 AI 導入優先序與管理決策框架",
      "哪些任務適合導入、哪些仍需人工判斷的明確邊界",
      "可延續的流程與文件標準，而不是一次性的示範"
    ],
    scenarios: [
      "團隊開始接觸 AI，但每個人理解不同，導致內部沒有共識。",
      "管理層希望提高效率，卻不確定哪些流程值得先投入。",
      "你需要一個能串起品牌、內容、管理與工作方法的上位策略。"
    ]
  },
  {
    id: "service-brand-design",
    name: "品牌與服務重整",
    description:
      "整理服務敘事、提案架構、報價層級與對外頁面內容，讓品牌更清楚地被客戶、搜尋引擎與 AI 系統理解。",
    serviceType: "Brand and Service Design",
    audience: "品牌主理人、專業服務團隊",
    bestFor: "適合服務內容說不清楚、品牌訊息分散、網站不夠聚焦的團隊。",
    outcomes: [
      "更清楚的服務架構與對外敘事方式",
      "更容易被理解與擷取的品牌文案與頁面內容",
      "讓高級感與資訊清晰度可以同時成立的內容策略"
    ],
    scenarios: [
      "潛在客戶進站後無法快速理解你真正提供什麼。",
      "品牌看起來不差，但服務層次與合作方式不夠明確。",
      "你希望頁面更符合 SEO / GEO，但不想做成廉價內容網站。"
    ]
  },
  {
    id: "service-enterprise-enablement",
    name: "企業合作與內訓",
    description:
      "以真實工作情境設計企業內訓、工作坊與導入節奏，讓管理者與團隊建立共同語言、工作標準與實作能力。",
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
    label: "AI 策略顧問",
    note: "先定義方向與邏輯"
  },
  {
    href: "#service-brand-design",
    label: "品牌與服務重整",
    note: "先整理對外訊息與服務架構"
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
    recommendation: "先從 AI 策略顧問開始",
    description:
      "當你還在盤點問題、優先序與導入範圍時，顧問比工作坊更適合，因為它能先建立判斷框架。"
  },
  {
    title: "如果你最需要的是整理品牌與服務",
    recommendation: "先從品牌與服務重整開始",
    description:
      "當你的服務內容、網站敘事或對外提案不夠清楚時，先整理品牌表達會比直接做訓練更有效。"
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
      "這一頁主要介紹 AI 策略顧問、品牌與服務重整，以及企業合作與內訓三大核心方向。"
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
  { href: "#service-ai-strategy", label: "AI 策略顧問" },
  { href: "#service-brand-design", label: "品牌與服務重整" },
  { href: "#service-enterprise-enablement", label: "企業合作與內訓" },
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
              AI 顧問、品牌設計與企業合作
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
