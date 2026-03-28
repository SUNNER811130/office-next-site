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
  const content = await readContent();
  return createPageMetadata({
    path: "/",
    title: content.brand.positioning,
    description: content.brand.summary,
    keywords: [content.brand.name, "AI 顧問", "品牌策略", "服務設計"]
  });
}

export default async function HomePage() {
  const content = await readContent();

  return (
    <>
      <JsonLd data={createFaqSchema(content.faq.items)} />

      <section className="relative overflow-hidden bg-oat">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),transparent_38%)]" />
        <div className="absolute inset-y-0 right-0 w-[44%] bg-[radial-gradient(circle_at_center,rgba(212,197,169,0.14),transparent_62%)]" />
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
              eyebrow="Brand Proposition"
              title="把抽象方向整理成可執行的前台與後台"
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
              title="常見的斷點通常不是缺工具，而是缺一條清楚主線"
              description="以下內容會直接由後台管理，首頁與其他頁面共用同一份 content store。"
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
              title="首頁模組與區塊圖全部由同一份內容資料驅動"
              description="上傳新的區塊圖後，只要把 URL 寫回內容資料，前台會直接吃到最新版本。"
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
              title="案例摘要與配圖同樣走 content store"
              description="這裡的圖片、問題、方法與結果，都能直接在後台更新。"
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
                    <strong className="text-midnight">Problem:</strong> {item.problem}
                  </p>
                  <p className="mt-3 text-sm text-slate">
                    <strong className="text-midnight">Approach:</strong> {item.approach}
                  </p>
                  <p className="mt-3 text-sm text-slate">
                    <strong className="text-midnight">Result:</strong> {item.result}
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
              <SectionTitle eyebrow="Client Logos" title="客戶標識區塊可隨內容資料隱藏或更新" />
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
              title="見證與 logo 也走同一套內容來源"
              description="如果 logo 或 avatar 留空，前台會自動退回純文字呈現，不顯示多餘 placeholder。"
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
