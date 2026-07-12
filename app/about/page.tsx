import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import Image from "next/image";
import { readContent } from "@/lib/content-store";
import { JsonLd, createBreadcrumbSchema, createFaqSchema, createPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const content = await readContent();
  return createPageMetadata({
    path: "/about",
    title: "關於 OFFICE NEXT 辦公進化所",
    description: `${content.brand.summary} ${content.founder.tagline}`,
    keywords: [
      content.brand.name,
      content.founder.name,
      "白領 AI 工作升級教練",
      "辦公自動化",
      "ChatGPT 工作應用",
      "工作流程升級"
    ]
  });
}

export default async function AboutPage() {
  const content = await readContent();

  return (
    <>
      <JsonLd
        data={[
          createBreadcrumbSchema([
            { name: "首頁", path: "/" },
            { name: "關於 OFFICE NEXT 辦公進化所", path: "/about" }
          ]),
          createFaqSchema(content.faq.items)
        ]}
      />

      <Section className="bg-oat">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <FadeUp>
            <p className="text-[11px] uppercase tracking-[0.34em] text-champagne">Founder</p>
            <h1 className="mt-5 max-w-[14ch] text-balance text-[clamp(2.3rem,4.8vw,4.25rem)] font-medium leading-[1.1] text-midnight">
              {content.founder.name}
            </h1>
            <p className="mt-5 text-sm uppercase tracking-[0.14em] text-champagne">{content.founder.role}</p>
            <p className="mt-5 max-w-[44rem] text-[1.05rem] leading-8 text-midnight md:text-[1.15rem]">{content.founder.tagline}</p>
            <div className="prose prose-slate mt-6 max-w-[42rem] text-[1.06rem]" dangerouslySetInnerHTML={{ __html: content.founder.bio }} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
              <ButtonLink href="/services">查看服務</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                聯絡 OFFICE NEXT
              </ButtonLink>
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="overflow-hidden rounded-[2.4rem] bg-white/70 p-4 shadow-elegant backdrop-blur-md">
              <Image
                src={content.founder.heroImageUrl || "/people/founder-hero.svg"}
                alt={content.founder.name}
                width={1600}
                height={2000}
                className="aspect-[4/5] w-full rounded-2xl object-cover"
              />
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <FadeUp>
            <SectionTitle eyebrow="Brand" title={content.brand.name} description={content.brand.summary} />
          </FadeUp>
          <StaggerContainer className="grid gap-5">
            <StaggerItem>
              <Card>
                <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Positioning</p>
                <div className="prose prose-slate mt-3 text-[1.06rem]" dangerouslySetInnerHTML={{ __html: content.brand.positioning }} />
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card>
                <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Proposition</p>
                <div className="prose prose-slate mt-3 text-[1.06rem]" dangerouslySetInnerHTML={{ __html: content.brand.proposition }} />
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card>
                <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Founder</p>
                <p className="mt-3 text-[1.2rem] text-midnight">{content.founder.name}</p>
                <p className="mt-2 text-sm text-slate">
                  {content.founder.role} · {content.founder.tagline}
                </p>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </Section>

      <Section surface="muted">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <FadeUp>
            <SectionTitle
              eyebrow="Founder"
              title="從醫療現場到 AI 辦公進化"
              description="對人的理解、教學現場與企業流程實作，構成 OFFICE NEXT 將 AI 工具轉化為可執行工作方法的基礎。"
            />
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="grid gap-5 md:grid-cols-2">
              {[
                { title: "過去", items: content.founder.pastExperience ?? [] },
                { title: "現任與專業", items: content.founder.currentRoles ?? [] },
                { title: "代表性客戶與培訓經歷", items: content.founder.representativeClients ?? [], wide: true }
              ].map((group) => group.items.length ? (
                <Card key={group.title} className={group.wide ? "md:col-span-2" : undefined}>
                  <h2 className="text-[1.35rem] font-medium text-midnight">{group.title}</h2>
                  <ul className="mt-5 grid gap-3 text-base leading-7 text-slate">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null)}
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <FadeUp>
            <SectionTitle eyebrow="Testimonials" title="白領工作流程升級後的真實回饋" />
          </FadeUp>
          <StaggerContainer className="grid gap-5">
            {content.testimonials.items.map((item) => (
              <StaggerItem key={`${item.name}-${item.company}`}>
                <Card>
                  <p className="text-lg text-midnight">&ldquo;{item.quote}&rdquo;</p>
                  <p className="mt-5 text-sm text-slate">
                    {item.name} · {item.role} · {item.company}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      <Section className="pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <FadeUp>
            <SectionTitle eyebrow="FAQ" title="關於 OFFICE NEXT 的常見問題" />
          </FadeUp>
          <FadeUp delay={0.15}>
            <FaqAccordion items={content.faq.items} firstOpen />
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
