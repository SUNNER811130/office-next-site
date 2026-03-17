import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

export const metadata: Metadata = {
  title: "品牌理念",
  description:
    "認識 OFFICE NEXT 辦公進化所的品牌故事、核心信念、方法論與品牌角色，理解我們如何幫助白領把工作方式升級到 AI 協作階段。 "
};

const beliefs = [
  "AI 的價值，不是炫技，而是減壓。",
  "工作升級，不只是更快，而是更聰明。",
  "不是每個人都要會寫程式，但每個人都可以學會與 AI 協作。",
  "未來職場的差距，是工作設計能力差距。"
];

const methodology = [
  {
    step: "01",
    title: "先看見重複",
    description: "先辨認每天反覆出現、最消耗注意力與時間的工作，找出真正值得優先改造的地方。"
  },
  {
    step: "02",
    title: "再拆解流程",
    description: "把任務拆成輸入、判斷、整理、產出與回覆，理解工作真正是怎麼被完成的。"
  },
  {
    step: "03",
    title: "找出 AI 協作點",
    description: "釐清哪些步驟適合交給 AI 協作，哪些關鍵判斷仍應由人主導，建立清楚分工。"
  },
  {
    step: "04",
    title: "建立可複製的工作方式",
    description: "把有效做法整理成可延續、可交接、可在團隊中擴散的標準，而不是一次性的技巧。"
  }
];

const roleNotes = [
  "OFFICE NEXT 由 SUN哥主理，品牌核心仍以 OFFICE NEXT 的方法與觀點為主體。",
  "角色定位聚焦於內容統整、方法設計與實務轉譯，協助複雜 AI 話題回到真實工作現場。",
  "不追求個人崇拜，而是建立一個值得被企業與專業工作者信任的工作升級品牌。"
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About OFFICE NEXT"
        title="我們不只教你用 AI，而是幫你重新設計工作的方式"
        description="OFFICE NEXT 專注白領 AI 提效、自動化與工作流程升級，從個人效率到團隊協作，協助更多人把工作做得更聰明、更穩定、更有價值。"
        primaryCta={{ href: "/services", label: "查看服務" }}
        secondaryCta={{ href: "/contact", label: "聯絡我們" }}
      />

      <Section className="pb-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionTitle
            eyebrow="Brand Story"
            title="OFFICE NEXT 存在，是因為太多工作其實值得被重新設計。"
            description="現在很多白領真正疲憊的，不是高難度挑戰，而是每天被大量零碎、重複、低價值但又不得不做的工作綁住。"
          />
          <div className="space-y-6 text-[1rem] text-slate md:text-[1.05rem]">
            <p>
              AI 出現後，許多人第一時間感受到的不是輕鬆，而是焦慮。工具更新太快、名詞太多、案例太碎，大家都擔心自己會不會落後，但真正關鍵的問題其實不是追上每一個新工具，而是重新思考工作的結構。
            </p>
            <p>
              什麼工作應該由人完成？什麼流程可以交給 AI 協作？什麼事情其實可以被重新設計？OFFICE NEXT 關心的，是這些更根本的問題。
            </p>
            <p>
              這就是 OFFICE NEXT 存在的原因。我們希望幫助更多白領工作者與團隊，從工具焦慮中退一步，改以更成熟的方式理解 AI，並真正把它放進日常工作。
            </p>
          </div>
        </div>
      </Section>

      <Section surface="muted" className="py-16 md:py-20 lg:py-24">
        <SectionTitle
          eyebrow="What We Believe"
          title="我們相信，真正的職場升級，是更會設計工作的方式。"
          description="品牌核心信念很清楚：真正的職場升級，不只是更努力，而是更會設計工作的方式。"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {beliefs.map((belief, index) => (
            <Card key={belief} className="flex min-h-[220px] flex-col justify-between">
              <p className="text-[11px] uppercase tracking-[0.26em] text-bronze">Belief 0{index + 1}</p>
              <p className="mt-8 max-w-[22rem] text-[1.25rem] leading-9 text-ink">{belief}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <SectionTitle
            eyebrow="Why White-Collar Work"
            title="為什麼 OFFICE NEXT 聚焦白領工作升級"
            description="因為白領工作的本質，正處在最值得被 AI 重新分工的階段。"
          />
          <div className="rounded-[2.4rem] border border-ink/8 bg-[#f6f1e9] px-7 py-8 md:px-9 md:py-10">
            <div className="space-y-5 text-[1rem] text-slate md:text-[1.05rem]">
              <p>
                白領工作大量依賴整理、彙整、撰寫、溝通、回覆、追蹤與協作。這些任務不是沒有價值，而是其中有相當多步驟早已可以被重新分工，交由 AI 協作處理。
              </p>
              <p>
                當這些重複工作被釋放，人才有機會把精力放回真正更重要的判斷、關係經營、策略思考與跨部門協作。這也是我們所理解的「工作升級」。
              </p>
              <p>
                因此 OFFICE NEXT 並不追逐科技感，而是專注在辦公現場，專注在那些每天都發生、卻最常被忽略的效率結構。
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section surface="muted">
        <SectionTitle
          eyebrow="Methodology"
          title="OFFICE NEXT 的方法論"
          description="我們不把 AI 視為單點工具，而是把它放回工作流程裡，用一套能落地的方式逐步建立新的協作秩序。"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {methodology.map((item) => (
            <Card key={item.step} className="min-h-[250px]">
              <p className="font-serif text-3xl italic leading-none text-bronze">{item.step}</p>
              <h2 className="mt-8 text-[1.45rem] font-medium leading-9 text-ink">{item.title}</h2>
              <p className="mt-5 max-w-[28rem] text-base text-slate">{item.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionTitle
            eyebrow="Brand Steward"
            title="OFFICE NEXT 由 SUN哥主理，品牌主體始終是方法與觀點。"
            description="主理人的角色，是把 AI、工作流程與白領現場需求整理成可理解、可信任、可採用的品牌內容與服務設計。"
          />
          <Card className="bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(244,237,227,0.95))]">
            <div className="space-y-5">
              {roleNotes.map((item) => (
                <div key={item} className="border-b border-ink/8 pb-5 last:border-none last:pb-0">
                  <p className="text-[1.03rem] text-slate">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section className="pb-24 pt-6 md:pt-8">
        <div className="rounded-[2.8rem] border border-white/10 bg-[linear-gradient(135deg,#111111_0%,#1c1c1c_100%)] px-8 py-12 text-paper shadow-[0_34px_90px_rgba(17,17,17,0.18)] md:px-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.16fr_0.84fr] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#d7c5ab]">Next Step</p>
              <h2 className="mt-5 max-w-[12ch] text-balance text-[2.2rem] font-medium leading-[1.14] md:text-[4rem]">
                讓工作方式升級，不必從變工程師開始
              </h2>
              <p className="mt-6 max-w-[38rem] text-[1rem] text-[#e6dfd5] md:text-[1.05rem]">
                如果你想把 AI 真正放進工作現場，而不是只停留在工具試用，OFFICE NEXT 可以協助你從個人效率到團隊流程，建立更成熟的工作方法。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
              <ButtonLink href="/services" className="bg-paper text-ink hover:bg-white">
                查看服務
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="secondary"
                className="border-white/16 bg-white/6 text-paper hover:bg-white/12 hover:text-paper"
              >
                聯絡我們
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
