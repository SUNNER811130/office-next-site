import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AnswerBlocks } from "@/components/ui/answer-blocks";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { JsonLd, createFaqSchema, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/",
  title: "白領工作與 AI 策略顧問",
  description:
    "OFFICE NEXT 協助品牌與企業把 AI 導入、服務設計與白領工作流程重新整理成可執行的策略，讓團隊在高變動環境中維持清晰與品質。",
  keywords: ["OFFICE NEXT", "AI 策略顧問", "白領工作設計", "企業 AI 內訓"]
});

const heroAnswers = [
  {
    question: "OFFICE NEXT 是什麼？",
    answer:
      "OFFICE NEXT 是一個聚焦白領工作、品牌溝通與 AI 導入的顧問品牌，提供策略設計、服務規劃與企業訓練。"
  },
  {
    question: "這個品牌適合哪些人？",
    answer:
      "適合正在重新定義團隊工作方式、服務流程與品牌敘事的創辦人、主管、顧問團隊與企業決策者。"
  }
];

const sectionAnswerBlocks = [
  {
    question: "什麼是白領 AI 工作升級？",
    answer:
      "不是單純學新工具，而是把 AI 放回提案、文件、協作、審稿與決策流程中，重新定義工作方式。"
  },
  {
    question: "OFFICE NEXT 能解決哪些常見問題？",
    answer:
      "我們處理品牌訊息分散、服務說不清楚、AI 導入失焦，以及團隊缺少一致方法等高頻問題。"
  }
];

const propositionCards = [
  {
    index: "01",
    title: "品牌感不犧牲清晰度",
    description:
      "我們在高級品牌語氣與高資訊密度之間建立平衡，讓內容同時能說服決策者，也能被搜尋引擎與 AI 理解。"
  },
  {
    index: "02",
    title: "策略先於工具",
    description:
      "真正的 AI 升級不是換一批工具，而是重整工作節奏、判斷標準與團隊溝通方式。"
  },
  {
    index: "03",
    title: "輸出可持續的方法",
    description:
      "我們偏好把顧問成果轉成文件、模組、規範與訓練，而不是只留下短暫的靈感。"
  }
];

const painPoints = [
  "品牌對外訊息不夠集中，潛在客戶不知道你真正提供什麼。",
  "團隊開始接觸 AI，但沒有共識，不知道哪些流程該導入、哪些不該。",
  "管理層希望提升效率，同時又擔心內容品質、品牌感與決策責任被稀釋。"
];

const services = [
  {
    title: "AI 策略顧問",
    audience: "適合管理者、創辦人與需要建立 AI 判斷框架的白領團隊。",
    description:
      "釐清導入目標、角色分工、流程節點與管理邊界，讓 AI 真正服務於工作，而不是製造新混亂。"
  },
  {
    title: "品牌與服務重整",
    audience: "適合品牌主理人、顧問型團隊與專業服務公司。",
    description:
      "整理服務敘事、報價層級、頁面內容與對外訊息，使品牌更精準、更容易被人與 AI 讀懂。"
  },
  {
    title: "企業合作與內訓",
    audience: "適合需要跨部門導入 AI 的企業與知識工作團隊。",
    description:
      "以實際工作情境設計內訓與導入節奏，讓組織在維持品質的前提下建立可延續的使用方法。"
  }
];

const flagshipModules = [
  {
    id: "module-strategy",
    eyebrow: "Module 01",
    title: "Decision Layer",
    summary: "把 AI 從靈感層拉回決策層。",
    description:
      "先界定哪些任務適合交給 AI、哪些仍需人主導，再建立管理者能持續沿用的判斷標準與授權方式。"
  },
  {
    id: "module-content",
    eyebrow: "Module 02",
    title: "Content Layer",
    summary: "讓內容產出更快，但不失去品牌辨識。",
    description:
      "從研究摘要、提案草稿、內部文件到品牌內容，我們把 AI 放進真正的內容流程，而不是停在單次示範。"
  },
  {
    id: "module-workflow",
    eyebrow: "Module 03",
    title: "Workflow Layer",
    summary: "建立可複製的白領工作系統。",
    description:
      "把會議、文件、提案、審稿與交付環節串成可持續運作的工作模組，降低團隊溝通與交接成本。"
  }
];

const faqs = [
  {
    question: "OFFICE NEXT 辦公進化所在做什麼？",
    answer:
      "OFFICE NEXT 專注於白領工作與 AI 協作升級，提供策略顧問、品牌與服務設計、企業內訓，以及工作流程重整。"
  },
  {
    question: "這個品牌適合哪些人？",
    answer:
      "適合創辦人、主管、品牌主理人、顧問型團隊，以及需要重新整理工作方式與對外表達的企業決策者。"
  },
  {
    question: "你們是教 AI 工具，還是教工作流程？",
    answer:
      "兩者都涵蓋，但工作流程優先。我們先定義任務、標準與決策方式，再決定哪些 AI 工具值得導入。"
  },
  {
    question: "不會寫程式也適合嗎？",
    answer:
      "適合。OFFICE NEXT 的核心受眾本來就是白領工作者、管理者與內容型團隊，而不是只面向工程背景使用者。"
  },
  {
    question: "企業可以怎麼合作？",
    answer:
      "企業可以從 AI 策略顧問、企業內訓、品牌與服務重整等方向開始，依現況與成熟度組合成適合的合作方案。"
  },
  {
    question: "GPT 智慧工作模組適合誰？",
    answer:
      "適合需要大量文件、提案、研究、品牌內容與跨部門溝通的知識工作團隊，尤其是正在建立 AI 工作標準的組織。"
  }
];

const sectionLinks = [
  { href: "#home-hero", label: "品牌主頁" },
  { href: "#home-brand", label: "品牌主張" },
  { href: "#home-services", label: "服務方向" },
  { href: "#home-flagship", label: "旗艦模組" },
  { href: "#home-faq", label: "常見問題" },
  { href: "#home-collaboration", label: "企業合作" }
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={createFaqSchema(faqs)} />

      <section id="home-hero" className="relative overflow-hidden border-b border-ink/6 bg-paper">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_40%)]" />
        <div className="absolute inset-y-0 right-0 w-[44%] bg-[radial-gradient(circle_at_center,rgba(131,104,74,0.12),transparent_62%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(17,17,17,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute left-[8%] top-24 h-32 w-32 rounded-full border border-bronze/20 bg-white/25 blur-3xl" />
        <div className="absolute bottom-16 right-[10%] h-40 w-40 rounded-full bg-[#d9cab6]/30 blur-3xl" />
        <Container className="relative grid gap-14 py-20 md:py-28 lg:min-h-[calc(100vh-78px)] lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24">
          <div className="max-w-[780px]">
            <p className="text-[11px] uppercase tracking-[0.36em] text-bronze">OFFICE NEXT</p>
            <h1 className="mt-6 max-w-[12ch] text-balance text-[3.55rem] font-medium leading-[0.96] tracking-[-0.04em] text-ink md:text-[5.8rem] lg:text-[6.6rem]">
              白領工作與 AI 策略顧問
            </h1>
            <p className="mt-8 max-w-[44rem] text-[1.06rem] leading-8 text-slate md:text-[1.2rem]">
              OFFICE NEXT 協助企業與品牌把 AI 導入、服務設計與工作流程整理成可執行的策略。關鍵品牌文案、
              服務方向與合作入口都直接存在於首頁 HTML，讓搜尋引擎、AI 系統與決策者都能立即讀懂你的價值。
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/services" className="px-7 py-4">
                查看 AI 策略與顧問服務
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="secondary"
                className="border-white/70 bg-white/65 px-7 py-4 backdrop-blur"
              >
                預約品牌與 AI 合作討論
              </ButtonLink>
            </div>
            <div className="mt-12 grid gap-4 border-t border-ink/8 pt-6 md:grid-cols-3">
              {[
                { label: "定位", value: "白領工作與 AI 策略" },
                { label: "服務", value: "顧問、內訓、品牌重整" },
                { label: "方法", value: "清晰、克制、可落地" }
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">{item.label}</p>
                  <p className="mt-2 text-sm leading-7 text-slate">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.9rem] bg-[#e7ddd1] md:translate-x-5 md:translate-y-5" />
            <div className="relative overflow-hidden rounded-[2.9rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,239,230,0.98))] p-7 shadow-[0_30px_90px_rgba(17,17,17,0.1)] md:p-9">
              <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),transparent)]" />
              <div className="relative">
                <div className="flex items-center justify-between border-b border-ink/8 pb-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-bronze">Quick Answers</p>
                    <p className="mt-2 text-xl font-medium text-ink md:text-2xl">品牌、服務與問題定義</p>
                  </div>
                  <span className="rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-[11px] tracking-[0.18em] text-slate">
                    EDITION 03
                  </span>
                </div>
                <div className="mt-6">
                  <AnswerBlocks items={heroAnswers} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <div className="sticky top-[78px] z-40 border-b border-ink/6 bg-paper/80 backdrop-blur-xl">
        <Container className="overflow-x-auto">
          <nav aria-label="首頁段落導覽" className="flex min-w-max gap-3 py-4">
            {sectionLinks.map((item) => (
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

      <Section id="home-brand" className="scroll-mt-36">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-bronze">Brand Proposition</p>
            <h2 className="mt-5 max-w-[14ch] text-balance text-[2.25rem] font-medium leading-[1.08] text-ink md:text-[4rem]">
              高級感不是空氣感，而是清楚又克制的判斷
            </h2>
            <p className="mt-6 max-w-[38rem] text-[1.04rem] text-slate md:text-[1.08rem]">
              這個區塊保留完整可讀內容，同時加入卡片的細緻 hover 回應與層次變化，讓品牌主張更有辨識度，但不把資訊藏起來。
            </p>
          </div>
          <div className="grid gap-5">
            {propositionCards.map((item) => (
              <article
                key={item.title}
                className="group rounded-[2.2rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,241,233,0.95))] px-7 py-7 shadow-[0_22px_55px_rgba(17,17,17,0.06)] transition duration-300 hover:-translate-y-1 hover:border-ink/14 hover:shadow-[0_30px_70px_rgba(17,17,17,0.1)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-3xl italic leading-none text-bronze">{item.index}</p>
                    <h3 className="mt-6 text-[1.35rem] font-medium leading-8 text-ink">{item.title}</h3>
                  </div>
                  <span className="mt-1 h-3 w-3 rounded-full bg-bronze/40 transition duration-300 group-hover:scale-125 group-hover:bg-bronze/70" />
                </div>
                <p className="mt-4 max-w-[40rem] text-base text-slate">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-0">
        <Container className="pb-6">
          <AnswerBlocks items={sectionAnswerBlocks} />
        </Container>
      </Section>

      <Section id="home-services" surface="muted" className="scroll-mt-36">
        <div className="grid gap-12">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-bronze">Pain Points</p>
              <h2 className="mt-5 max-w-[13ch] text-balance text-[2.15rem] font-medium leading-[1.1] text-ink md:text-[3.8rem]">
                多數團隊卡住的，不是工具，而是節奏與定義
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {painPoints.map((item, index) => (
                <article
                  key={item}
                  className="rounded-[2.2rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,242,233,0.94))] p-8 shadow-[0_24px_60px_rgba(17,17,17,0.06)] transition duration-300 hover:-translate-y-1 hover:border-ink/14 hover:shadow-[0_32px_80px_rgba(17,17,17,0.1)]"
                >
                  <p className="font-serif text-3xl italic leading-none text-bronze">0{index + 1}</p>
                  <p className="mt-10 text-[1.08rem] leading-8 text-slate">{item}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="group rounded-[2.4rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,233,0.98))] p-8 shadow-[0_24px_60px_rgba(17,17,17,0.06)] transition duration-300 hover:-translate-y-1 hover:border-ink/14 hover:shadow-[0_32px_80px_rgba(17,17,17,0.1)]"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Service Direction</p>
                <h3 className="mt-5 text-[1.5rem] font-medium leading-9 text-ink">{service.title}</h3>
                <p className="mt-4 text-base text-slate">{service.description}</p>
                <div className="mt-6 border-t border-ink/8 pt-5">
                  <p className="text-sm leading-7 text-slate">{service.audience}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section id="home-flagship" className="scroll-mt-36">
        <div className="rounded-[3rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,237,227,0.95))] px-6 py-8 shadow-[0_30px_90px_rgba(17,17,17,0.07)] md:px-10 md:py-10 lg:px-12 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-bronze">Flagship Module</p>
              <h2 className="mt-5 max-w-[12ch] text-balance text-[2.2rem] font-medium leading-[1.08] text-ink md:text-[4rem]">
                GPT 智慧工作模組，像產品一樣被展示
              </h2>
              <p className="mt-6 max-w-[34rem] text-[1.04rem] text-slate">
                這裡以 tabs 感的段落導覽呈現，但所有內容都已先 server-rendered。切換依靠可爬的錨點連結，只改變使用者觀看節奏，不改變內容可讀性。
              </p>
              <nav aria-label="旗艦模組導覽" className="mt-8 flex flex-wrap gap-3">
                {flagshipModules.map((module) => (
                  <a
                    key={module.id}
                    href={`#${module.id}`}
                    className="rounded-full border border-ink/8 bg-white/75 px-4 py-2 text-sm text-slate transition hover:border-ink/16 hover:bg-white hover:text-ink"
                  >
                    {module.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="space-y-5">
              {flagshipModules.map((module) => (
                <article
                  id={module.id}
                  key={module.id}
                  className="scroll-mt-44 rounded-[2.3rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,242,233,0.98))] px-7 py-7 transition duration-300 hover:-translate-y-1 hover:border-ink/14 hover:shadow-[0_28px_65px_rgba(17,17,17,0.08)]"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-bronze">{module.eyebrow}</p>
                      <h3 className="mt-4 text-[1.65rem] font-medium leading-10 text-ink">{module.title}</h3>
                    </div>
                    <p className="max-w-[18rem] text-sm uppercase tracking-[0.16em] text-slate/80">
                      {module.summary}
                    </p>
                  </div>
                  <p className="mt-6 max-w-[44rem] text-[1.02rem] text-slate">{module.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="home-faq" className="scroll-mt-36">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-bronze">FAQ</p>
            <h2 className="mt-5 max-w-[13ch] text-balance text-[2.2rem] font-medium leading-[1.08] text-ink md:text-[4rem]">
              讓 AI 與使用者都能快速讀懂的常見問題
            </h2>
            <p className="mt-6 max-w-[35rem] text-[1.04rem] text-slate">
              FAQ 採用高級 accordion 呈現，但每一則答案都已經直接輸出在 HTML 中，兼顧閱讀體驗與搜尋擷取效率。
            </p>
          </div>
          <FaqAccordion items={faqs} firstOpen />
        </div>
      </Section>

      <Section id="home-collaboration" className="scroll-mt-36 pb-24 pt-8 md:pt-10">
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[linear-gradient(135deg,#121212_0%,#1d1b1a_45%,#2a241f_100%)] px-8 py-12 text-paper shadow-[0_38px_96px_rgba(17,17,17,0.2)] md:px-12 md:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,197,171,0.22),transparent_36%)]" />
          <div className="absolute inset-y-0 right-0 w-[38%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.03))]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#d7c5ab]">Collaboration</p>
              <h2 className="mt-5 max-w-[12ch] text-balance text-[2.3rem] font-medium leading-[1.08] md:text-[4.2rem]">
                當你希望品牌與工作方式一起升級，這就是下一步
              </h2>
              <p className="mt-6 max-w-[39rem] text-[1rem] text-[#e7ded3] md:text-[1.06rem]">
                這個收斂區塊保留明確邀請語氣，但不做表單堆疊。它更像品牌邀請函，讓高意圖訪客能直接前往服務頁或合作聯絡頁。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
              <ButtonLink href="/services" className="bg-paper px-7 py-4 text-ink hover:bg-white">
                查看完整服務與合作方式
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="secondary"
                className="border-white/16 bg-white/8 px-7 py-4 text-paper hover:bg-white/14 hover:text-paper"
              >
                前往聯絡頁提出合作需求
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
