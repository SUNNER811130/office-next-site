import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
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

      <section className="relative overflow-hidden bg-oat">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,22,42,0.08),transparent_42%),radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_38%)]" />
        <div className="absolute inset-y-0 right-0 w-[44%] bg-[radial-gradient(circle_at_center,rgba(120,183,204,0.16),transparent_62%)]" />
        <Container className="relative grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_0.94fr] lg:items-center">
          <FadeUp>
            <p className="text-[11px] uppercase tracking-[0.34em] text-champagne">{content.home.hero.eyebrow}</p>
            <h1 className="mt-6 max-w-[11ch] text-balance text-[3rem] font-medium leading-[0.98] text-midnight md:text-[5.2rem]">
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
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="relative">
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.8rem] bg-champagne/20" />
              <div className="relative overflow-hidden rounded-[2.8rem] bg-white/70 p-4 shadow-elegant backdrop-blur-md">
                <Image
                  src={content.home.hero.imageUrl || "/sections/advisory-01.svg"}
                  alt={content.home.hero.title}
                  width={1200}
                  height={1500}
                  className="aspect-[4/5] w-full rounded-[2rem] object-cover"
                />
              </div>
            </div>
          </FadeUp>
        </Container>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
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
                <Card>
                  <h3 className="text-[1.3rem] font-medium text-midnight">{item.title}</h3>
                  <p className="mt-4 text-base text-slate">{item.description}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      <Section surface="muted">
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
                <Card>
                  <p className="font-serif text-3xl italic leading-none text-champagne">0{index + 1}</p>
                  <p className="mt-8 text-[1.05rem] text-slate">{item}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      <Section>
        <StaggerContainer className="grid gap-5 lg:grid-cols-3">
          {content.services.items.map((service) => (
            <StaggerItem key={service.title}>
              <Card>
                {service.imageUrl ? (
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    width={1600}
                    height={1200}
                    className="aspect-[4/3] w-full rounded-2xl object-cover"
                  />
                ) : null}
                <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-champagne">Service Direction</p>
                <h3 className="mt-4 text-[1.45rem] font-medium text-midnight">{service.title}</h3>
                <p className="mt-4 text-base text-slate">{service.description}</p>
                <p className="mt-5 border-t border-midnight/8 pt-5 text-sm text-slate">{service.audience}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      <Section surface="muted">
        <div className="grid gap-10">
          <FadeUp>
            <SectionTitle
              eyebrow="Flagship Modules"
              title="從提示詞、GAS 到 Agent，逐步建立你的 AI 工作流"
              description="先讓 AI 幫你少做一段重複事，再把高頻流程整理成可維護、可交接、可擴充的辦公系統。"
            />
          </FadeUp>
          <StaggerContainer className="grid gap-5 lg:grid-cols-3">
            {content.home.flagshipModules.map((module) => (
              <StaggerItem key={module.title}>
                <Card>
                  <Image
                    src={module.imageUrl || "/sections/strategy-session-01.svg"}
                    alt={module.title}
                    width={1600}
                    height={1200}
                    className="aspect-[4/3] w-full rounded-2xl object-cover"
                  />
                  <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-champagne">{module.eyebrow}</p>
                  <h3 className="mt-4 text-[1.35rem] font-medium text-midnight">{module.title}</h3>
                  <p className="mt-3 text-sm uppercase tracking-[0.12em] text-slate">{module.summary}</p>
                  <p className="mt-4 text-base text-slate">{module.description}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      <Section>
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
                <Card>
                  <Image
                    src={item.imageUrl || "/sections/advisory-01.svg"}
                    alt={item.title}
                    width={1600}
                    height={1200}
                    className="aspect-[4/3] w-full rounded-2xl object-cover"
                  />
                  <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-champagne">{item.category}</p>
                  <h3 className="mt-4 text-[1.35rem] font-medium text-midnight">{item.title}</h3>
                  <p className="mt-4 text-sm text-slate">
                    <strong className="text-midnight">問題：</strong> {item.problem}
                  </p>
                  <p className="mt-3 text-sm text-slate">
                    <strong className="text-midnight">做法：</strong> {item.approach}
                  </p>
                  <p className="mt-3 text-sm text-slate">
                    <strong className="text-midnight">成果：</strong> {item.result}
                  </p>
                </Card>
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
