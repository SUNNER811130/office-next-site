import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { DataStream, GlowCard, ProcessRail, ScrollSignal, TechGrid, WorkflowConsole } from "@/components/home/tech-interactions";
import { DepthReveal, FadeUp, FlyInPanel, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import Image from "next/image";
import { readContent } from "@/lib/content-store";
import { JsonLd, createFaqSchema, createPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createPageMetadata({
    path: "/",
    title: "白領 AI 提效與辦公自動化",
    description:
      "OFFICE NEXT 辦公進化所聚焦 ChatGPT 工作應用、辦公自動化與 AI 工作流程，協助白領把重複工作交給 AI，升級日常流程並準時下班。",
    keywords: [
      "白領 AI 提效",
      "辦公自動化",
      "ChatGPT 工作應用",
      "AI 工作流程",
      "準時下班",
      "會議紀錄自動化",
      "資料整理",
      "提案摘要",
      "報表彙整"
    ]
  });
}

export default async function HomePage() {
  const content = await readContent();

  return (
    <>
      <JsonLd data={createFaqSchema(content.faq.items)} />

      <section className="relative overflow-hidden border-b border-white/70 bg-[linear-gradient(135deg,#F8FAFC_0%,#EAF2F7_45%,#DDE9F0_100%)]">
        <TechGrid intensity="strong" className="opacity-[0.18]" />
        <DataStream className="opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(110,167,191,0.34),transparent_32%),radial-gradient(circle_at_78%_24%,rgba(7,26,47,0.18),transparent_36%),linear-gradient(115deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.56)_42%,rgba(231,241,247,0.72)_100%)]" />
        <div aria-hidden="true" className="absolute -right-32 top-20 h-[32rem] w-[32rem] rounded-full border border-champagne/20 bg-[radial-gradient(circle,rgba(110,167,191,0.22),transparent_58%)] blur-sm" />
        <div aria-hidden="true" className="absolute left-[8%] top-[18%] h-px w-[46%] rotate-[-16deg] bg-[linear-gradient(90deg,transparent,rgba(110,167,191,0.64),transparent)]" />
        <Container className="relative grid gap-12 py-16 md:py-24 lg:min-h-[calc(100vh-88px)] lg:grid-cols-[1fr_0.94fr] lg:items-center lg:py-20">
          <FadeUp>
            <p className="text-[11px] uppercase tracking-[0.34em] text-champagne">{content.home.hero.eyebrow}</p>
            <h1 className="title-scan mt-6 max-w-[11ch] text-balance text-[3rem] font-medium leading-[0.98] text-midnight md:text-[5.2rem]">
              {content.home.hero.title}
            </h1>
            <div 
              className="prose prose-slate mt-7 max-w-[42rem] text-[1.05rem] md:text-[1.18rem] md:prose-lg"
              dangerouslySetInnerHTML={{ __html: content.home.hero.description }} 
            />
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={content.home.hero.ctaPrimaryHref}>{content.home.hero.ctaPrimaryLabel}</ButtonLink>
              <ButtonLink href={content.home.hero.ctaSecondaryHref} variant="secondary">
                {content.home.hero.ctaSecondaryLabel}
              </ButtonLink>
            </div>
            <div className="mt-12 grid gap-4 border-t border-midnight/8 pt-6 md:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Brand</p>
                <div className="prose prose-sm prose-slate mt-2 leading-7" dangerouslySetInnerHTML={{ __html: content.brand.summary }} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Positioning</p>
                <div className="prose prose-sm prose-slate mt-2 leading-7" dangerouslySetInnerHTML={{ __html: content.brand.positioning }} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Founder</p>
                <p className="mt-2 text-sm leading-7 text-slate">{content.founder.tagline}</p>
              </div>
            </div>
            <ScrollSignal className="mt-9" />
          </FadeUp>

          <FlyInPanel delay={0.16}>
            <WorkflowConsole />
          </FlyInPanel>
        </Container>
      </section>

      <Section className="section-portal">
        <DepthReveal className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <FadeUp>
            <SectionTitle
              eyebrow="Work Upgrade"
              title="讓 AI 接手重複環節，把人留給更高價值的判斷"
              description={<div className="prose prose-slate prose-sm" dangerouslySetInnerHTML={{ __html: content.brand.proposition }} />}
            />
          </FadeUp>
          <StaggerContainer className="grid gap-5">
            {content.home.propositionCards.map((item) => (
              <StaggerItem key={item.title}>
                <GlowCard>
                  <h3 className="text-[1.3rem] font-medium text-midnight">{item.title}</h3>
                  <p className="mt-4 text-base text-slate">{item.description}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </DepthReveal>
      </Section>

      <Section surface="muted" className="section-portal relative overflow-hidden">
        <TechGrid intensity="strong" className="opacity-[0.12]" />
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <FadeUp>
            <SectionTitle
              eyebrow="Pain Points"
              title="白領每天最耗損的，通常不是大事，而是做不完的小事"
              description="會議紀錄、資料整理、提案摘要、報表彙整與反覆修稿，都是 AI 可以協作、流程可以升級的工作。"
            />
          </FadeUp>
          <StaggerContainer className="grid gap-5 md:grid-cols-3">
            {content.home.painPoints.map((item, index) => (
              <StaggerItem key={item}>
                <GlowCard className="min-h-[300px]">
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="relative h-28">
                      <div className="orbit-node absolute left-0 top-0 h-28 w-28 rounded-full border border-champagne/28" />
                      <div className="absolute left-4 top-4 h-20 w-20 rounded-full border border-champagne/42" />
                      <div className="absolute left-9 top-9 h-10 w-10 rounded-full border border-champagne/28 bg-champagne/12 shadow-[0_0_28px_rgba(110,167,191,0.34)]" />
                      <div className="node-pulse absolute left-[3.1rem] top-[3.1rem] h-3 w-3 rounded-full bg-champagne shadow-[0_0_22px_rgba(110,167,191,0.7)]" />
                      <div className="absolute left-28 top-12 h-px w-24 bg-[linear-gradient(90deg,rgba(110,167,191,0.82),transparent)]" />
                      <p className="absolute right-0 top-0 text-[11px] uppercase tracking-[0.26em] text-champagne">Drain 0{index + 1}</p>
                      <p className="absolute bottom-0 left-0 rounded-full border border-champagne/20 bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate">Load Alert</p>
                    </div>
                    <p className="mt-7 text-[1.05rem] text-slate">{item}</p>
                  </div>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      <Section className="section-portal">
        <StaggerContainer className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {content.services.items.map((service, index) => (
            <StaggerItem key={service.title}>
              <GlowCard className="min-h-full">
                {service.imageUrl ? (
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    width={1600}
                    height={1200}
                    className="aspect-[4/3] w-full rounded-xl border border-white/70 object-cover"
                  />
                ) : null}
                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Module 0{index + 1}</p>
                  <span className="live-badge rounded-full border border-champagne/28 bg-champagne/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-champagne">Unlock</span>
                </div>
                <h3 className="mt-4 text-[1.45rem] font-medium text-midnight">{service.title}</h3>
                <p className="mt-4 text-base text-slate">{service.description}</p>
                <p className="mt-5 border-t border-midnight/8 pt-5 text-sm text-slate">{service.audience}</p>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      <Section surface="muted" className="section-portal relative overflow-hidden">
        <TechGrid intensity="strong" className="opacity-[0.12]" />
        <div className="relative grid gap-10">
          <FadeUp>
            <SectionTitle
              eyebrow="Flagship Modules"
              title="從提示詞、GAS 到 Agent，逐步建立你的 AI 工作流"
              description="先讓 AI 幫你少做一段重複事，再把高頻流程整理成可維護、可交接、可擴充的辦公系統。"
            />
          </FadeUp>
          <FadeUp delay={0.08}>
            <ProcessRail
              items={content.home.flagshipModules.map((module) => ({
                label: module.eyebrow,
                title: module.title,
                description: `${module.summary}。${module.description}`
              }))}
            />
          </FadeUp>
        </div>
      </Section>

      <Section className="section-portal">
        <div className="grid gap-10">
          <FadeUp>
            <SectionTitle
              eyebrow="Cases"
              title="辦公 AI 提效案例：從一個痛點開始，改掉一段重複流程"
              description="OFFICE NEXT 的案例聚焦白領真實工作場景，包含會議、表單、試算表、信件與團隊協作。"
            />
          </FadeUp>
          <StaggerContainer className="grid gap-5 lg:grid-cols-3">
            {content.cases.items.map((item) => (
              <StaggerItem key={item.title}>
                <GlowCard className="min-h-full">
                  <Image
                    src={item.imageUrl || "/sections/advisory-01.svg"}
                    alt={item.title}
                    width={1600}
                    height={1200}
                    className="aspect-[4/3] w-full rounded-xl border border-white/70 object-cover"
                  />
                  <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-champagne">{item.category}</p>
                  <h3 className="mt-4 text-[1.35rem] font-medium text-midnight">{item.title}</h3>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-xl border border-midnight/8 bg-white/68 p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-champagne">Problem</p>
                      <p className="mt-2 text-sm text-slate">{item.problem}</p>
                    </div>
                    <div className="rounded-xl border border-midnight/8 bg-white/68 p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-champagne">Approach</p>
                      <p className="mt-2 text-sm text-slate">{item.approach}</p>
                    </div>
                    <div className="rounded-xl border border-champagne/28 bg-champagne/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-midnight">Result</p>
                        <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-slate">Reduced</span>
                      </div>
                      <p className="mt-2 text-sm text-slate">{item.result}</p>
                    </div>
                  </div>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {content.clientLogos.length > 0 ? (
        <Section surface="muted">
          <div className="grid gap-8">
            <FadeUp>
              <SectionTitle eyebrow="Trusted by Teams" title="和重視效率與流程品質的團隊一起升級辦公方式" />
            </FadeUp>
            <StaggerContainer className="grid gap-4 md:grid-cols-3">
              {content.clientLogos.map((logo) => (
                <StaggerItem key={logo.name}>
                  <div className="flex items-center justify-center rounded-2xl bg-white/70 p-8 shadow-glass backdrop-blur-md">
                    <Image
                      src={logo.url || "/logos/client-01.svg"}
                      alt={logo.name}
                      width={400}
                      height={100}
                      className="h-12 w-auto max-w-full object-contain"
                    />
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Section>
      ) : null}

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <FadeUp>
            <SectionTitle
              eyebrow="Testimonials"
              title="真正的 AI 提效，是讓日常工作變輕、輸出變穩"
              description="從個人模板到團隊共識，OFFICE NEXT 協助白領把 AI 變成可落地的工作協作員。"
            />
          </FadeUp>
          <StaggerContainer className="grid gap-5">
            {content.testimonials.items.map((item) => (
              <StaggerItem key={`${item.name}-${item.company}`}>
                <Card>
                  <p className="text-lg leading-8 text-midnight">&ldquo;{item.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-4">
                    {item.avatarUrl ? (
                      <Image src={item.avatarUrl} alt={item.name} width={100} height={100} className="h-14 w-14 rounded-full object-cover" />
                    ) : item.logoUrl ? (
                      <Image
                        src={item.logoUrl}
                        alt={item.company}
                        width={300}
                        height={100}
                        className="h-10 w-auto max-w-[120px] object-contain"
                      />
                    ) : null}
                    <div>
                      <p className="font-medium text-midnight">{item.name}</p>
                      <p className="text-sm text-slate">
                        {item.role} · {item.company}
                      </p>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      <Section className="pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <FadeUp>
            <SectionTitle eyebrow="FAQ" title="常見問題" description={content.contact.responseExpectation} />
          </FadeUp>
          <FadeUp delay={0.15}>
            <FaqAccordion items={content.faq.items} firstOpen />
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
