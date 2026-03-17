import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

const overviewPoints = [
  {
    index: "01",
    title: "從工作現場出發",
    description:
      "我們談的不是抽象工具功能，而是行政、企劃、行銷、業務、PM 與主管每天真正會遇到的資訊整理、溝通與協作工作。"
  },
  {
    index: "02",
    title: "建立可複製的方法",
    description:
      "服務重點不是一次性的加速，而是幫你整理出可持續使用、可擴張到團隊的工作方法，讓成果更穩定。"
  },
  {
    index: "03",
    title: "把 AI 放進日常節奏",
    description:
      "OFFICE NEXT 協助你把 AI 變成工作協作員，讓提案、整理、會議與內容產出都能更順地接上原本的工作流程。"
  }
];

const services = [
  {
    id: "01",
    title: "白領 AI 課程",
    description:
      "從正確使用 GPT，到日常工作中的 AI 協作應用，幫助個人建立更聰明、更省力的工作方式。",
    audience: "行政、企劃、行銷、業務、PM、主管",
    outcome: "更快整理資訊、更穩定輸出內容、減少重工與重複"
  },
  {
    id: "02",
    title: "GPT 智慧工作模組",
    description:
      "OFFICE NEXT 的旗艦課程，聚焦白領日常工作中最常見的資訊整理、提案架構、文案優化、會議彙整與半自動協作應用。",
    audience: "想將 GPT 真正用進工作的人",
    outcome: "從知道工具，到真正會用工具做事"
  },
  {
    id: "03",
    title: "工作坊 / 實戰訓練",
    description:
      "以實際工作場景為核心，透過案例與操作，讓學習不只是理解概念，而是直接進入應用。",
    audience: "需要落地實作而非理論導向的團隊或個人",
    outcome: "快速建立可立即使用的方法與流程"
  },
  {
    id: "04",
    title: "企業內訓",
    description:
      "協助企業從部門工作現場出發，設計更合適的 AI 提效與工作升級方案。",
    audience: "企業、部門主管、HR、培訓單位",
    outcome: "團隊效率提升、AI 使用落差縮小、工作節奏更一致"
  },
  {
    id: "05",
    title: "流程優化顧問",
    description:
      "針對特定工作場景重新梳理任務流程，找出可被 AI 協作與優化的關鍵節點。",
    audience: "希望優化工作方法與流程的團隊或品牌",
    outcome: "流程更清楚、重複工作減少、協作更順暢"
  }
];

const audiences = [
  "每天被大量重複性工作消耗",
  "用過 AI 工具，但還沒真正融入工作",
  "團隊想升級，但沒有清楚方法",
  "希望減少瞎忙，提升工作品質與效率",
  "想建立可複製、可持續的工作方式"
];

const processSteps = [
  {
    step: "01",
    title: "了解需求",
    description: "先釐清你目前的工作型態、團隊現況與希望改善的方向，確認問題不是表面上的工具焦慮。"
  },
  {
    step: "02",
    title: "盤點工作場景",
    description: "進一步拆解真實任務流程，找出哪些工作重複、哪些協作斷點值得優先處理。"
  },
  {
    step: "03",
    title: "設計適合的方案",
    description: "依照你的目標與資源條件，配置適合的課程、工作坊、內訓或流程優化方式，而不是套用固定模板。"
  },
  {
    step: "04",
    title: "執行與優化",
    description: "把方法真正落地到工作現場，並持續調整操作方式，讓 AI 協作可以穩定成為日常的一部分。"
  }
];

function ServicesHero() {
  return (
    <section className="relative overflow-hidden border-b border-ink/6 bg-[#f6f1e9] pb-16 pt-20 md:pb-20 md:pt-28 lg:pb-24 lg:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.74),transparent_38%)]" />
      <div className="absolute inset-y-0 right-0 w-[46%] bg-[radial-gradient(circle_at_center,rgba(131,104,74,0.08),transparent_62%)]" />
      <div className="absolute inset-0 bg-hero-grid bg-[size:72px_72px] opacity-[0.05]" />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="max-w-[760px]">
            <p className="text-[11px] uppercase tracking-[0.34em] text-bronze">Services</p>
            <h1 className="mt-5 max-w-[11ch] text-balance text-[2.9rem] font-medium leading-[1.06] text-ink md:text-[4.8rem] lg:text-[5.4rem]">
              為白領設計的 AI 工作升級服務
            </h1>
            <p className="mt-7 max-w-[43rem] text-[1.04rem] text-slate md:text-[1.16rem]">
              從個人工作提效，到團隊協作升級，OFFICE NEXT 提供課程、工作坊、企業內訓與流程優化服務，幫助你把 AI 真正用進日常工作。
            </p>
            <p className="mt-5 text-[0.98rem] uppercase tracking-[0.18em] text-bronze/90 md:text-[1rem]">
              不是增加更多工具，而是建立更好的工作方式。
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/contact">聯絡洽詢</ButtonLink>
              <ButtonLink href="/corporate-training" variant="secondary">
                查看企業合作
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[2.4rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,242,233,0.92))] p-7 shadow-[0_28px_70px_rgba(17,17,17,0.08)] backdrop-blur-sm md:p-9">
            <p className="text-[11px] uppercase tracking-[0.3em] text-bronze">Service Focus</p>
            <div className="mt-6 space-y-5">
              <div className="border-b border-ink/8 pb-5">
                <p className="text-sm uppercase tracking-[0.18em] text-slate/70">個人升級</p>
                <p className="mt-2 text-[1.18rem] leading-8 text-ink">讓日常工作更快、更穩、更不容易重工。</p>
              </div>
              <div className="border-b border-ink/8 pb-5">
                <p className="text-sm uppercase tracking-[0.18em] text-slate/70">團隊協作</p>
                <p className="mt-2 text-[1.18rem] leading-8 text-ink">讓部門之間的工作節奏更一致，縮小 AI 使用落差。</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate/70">流程優化</p>
                <p className="mt-2 text-[1.18rem] leading-8 text-ink">把反覆出現的工作節點重新整理，讓 AI 真正接得上流程。</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ServicesOverviewSection() {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <SectionTitle
          eyebrow="Overview"
          title="你不需要學更多，而是需要用得更對"
          description="OFFICE NEXT 的服務，不是把 AI 當作炫技工具，而是幫助你在真實工作場景中，建立更有效率、更穩定、更能複製的工作方法。"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {overviewPoints.map((item) => (
            <Card
              key={item.index}
              className="flex min-h-[260px] flex-col justify-between rounded-[2.2rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,241,233,0.9))]"
            >
              <p className="font-serif text-3xl italic leading-none text-bronze">{item.index}</p>
              <div className="mt-10">
                <h2 className="text-[1.38rem] font-medium leading-8 text-ink">{item.title}</h2>
                <p className="mt-4 text-[1rem] text-slate">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ServiceDetailsSection() {
  return (
    <Section surface="muted">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <SectionTitle
          eyebrow="Signature Services"
          title="服務不是堆疊項目，而是對應不同工作升級階段"
          description="無論你是想先把個人工作做順，還是要帶動整個團隊的協作升級，OFFICE NEXT 都有對應的服務形式，幫你從知道 AI，走到真正會一起工作。"
        />
        <div className="space-y-5">
          {services.map((service) => (
            <Card
              key={service.id}
              className="rounded-[2.5rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,242,233,0.94))] p-0"
            >
              <div className="grid gap-6 px-7 py-7 md:px-8 md:py-8 lg:grid-cols-[92px_1fr]">
                <div className="flex items-start lg:justify-center">
                  <span className="font-serif text-[2.6rem] italic leading-none text-bronze">{service.id}</span>
                </div>
                <div>
                  <h2 className="text-[1.55rem] font-medium leading-9 text-ink">{service.title}</h2>
                  <p className="mt-4 max-w-[48rem] text-[1rem] text-slate">{service.description}</p>
                  <div className="mt-6 grid gap-4 border-t border-ink/8 pt-6 md:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">適合對象</p>
                      <p className="mt-3 text-[1rem] text-ink">{service.audience}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">可得到的結果</p>
                      <p className="mt-3 text-[1rem] text-ink">{service.outcome}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

function AudienceSection() {
  return (
    <Section>
      <div className="rounded-[2.8rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(246,239,230,0.9))] px-7 py-10 shadow-[0_26px_70px_rgba(17,17,17,0.06)] md:px-10 md:py-12 lg:px-12 lg:py-14">
        <SectionTitle
          eyebrow="Who It Is For"
          title="這些服務，適合正在面對以下情境的人"
          description="如果你不是缺少工具，而是缺少更清楚的方法與節奏，這些服務就是為你準備的。"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {audiences.map((item, index) => (
            <div
              key={item}
              className="flex min-h-[220px] flex-col justify-between rounded-[2rem] border border-white/80 bg-white/70 px-6 py-7 shadow-[0_18px_45px_rgba(17,17,17,0.05)]"
            >
              <p className="font-serif text-3xl italic leading-none text-bronze">0{index + 1}</p>
              <p className="mt-10 text-[1.16rem] leading-8 text-ink">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ProcessSection() {
  return (
    <Section surface="muted">
      <SectionTitle
        eyebrow="Process"
        title="從需求到落地，我們會一起走完這段過程"
        description="合作不只是一次課程安排，而是從需求釐清到落地優化的完整過程。"
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-4">
        {processSteps.map((item) => (
          <Card
            key={item.step}
            className="relative min-h-[280px] rounded-[2.3rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,241,233,0.94))]"
          >
            <div className="absolute left-8 top-8 h-px w-12 bg-bronze/45" />
            <p className="pt-10 font-serif text-3xl italic leading-none text-bronze">{item.step}</p>
            <h2 className="mt-8 text-[1.4rem] font-medium leading-8 text-ink">{item.title}</h2>
            <p className="mt-4 text-[1rem] text-slate">{item.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function FinalCta() {
  return (
    <Section className="pb-24 pt-8 md:pt-10">
      <div className="rounded-[2.9rem] border border-white/10 bg-[linear-gradient(135deg,#111111_0%,#1d1d1d_100%)] px-8 py-12 text-paper shadow-[0_36px_92px_rgba(17,17,17,0.18)] md:px-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.14fr_0.86fr] lg:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#d7c5ab]">Next Step</p>
            <h2 className="mt-5 max-w-[12ch] text-balance text-[2.2rem] font-medium leading-[1.14] md:text-[4rem]">
              找到最適合你的工作升級方式
            </h2>
            <p className="mt-6 max-w-[39rem] text-[1rem] text-[#e6dfd5] md:text-[1.05rem]">
              如果你正在思考，哪些工作該交給 AI、哪些流程值得重新設計，OFFICE NEXT 可以陪你一起找到更適合的方式。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <ButtonLink href="/contact" className="bg-paper text-ink hover:bg-white">
              聯絡洽詢
            </ButtonLink>
            <ButtonLink
              href="/corporate-training"
              variant="secondary"
              className="border-white/16 bg-white/6 text-paper hover:bg-white/12 hover:text-paper"
            >
              查看企業合作
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function ServicesPageContent() {
  return (
    <>
      <ServicesHero />
      <ServicesOverviewSection />
      <ServiceDetailsSection />
      <AudienceSection />
      <ProcessSection />
      <FinalCta />
    </>
  );
}
