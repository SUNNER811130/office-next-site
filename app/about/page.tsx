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
    title: `About ${content.brand.name}`,
    description: `${content.brand.summary} ${content.founder.tagline}`,
    keywords: [content.brand.name, content.founder.name, "主理人", "品牌顧問"]
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
            { name: `About ${content.brand.name}`, path: "/about" }
          ]),
          createFaqSchema(content.faq.items)
        ]}
      />

      <Section className="bg-oat">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <FadeUp>
            <p className="text-[11px] uppercase tracking-[0.34em] text-champagne">About</p>
            <h1 className="mt-5 max-w-[12ch] text-balance text-[2.9rem] font-medium leading-[1.06] text-midnight md:text-[4.8rem]">
              {content.founder.tagline}
            </h1>
            <div className="prose prose-slate mt-6 max-w-[42rem] text-[1.06rem]" dangerouslySetInnerHTML={{ __html: content.founder.bio }} />
            <div className="mt-10 flex gap-3">
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
              title="主理人資料與照片會直接從後台回寫到前台"
              description="如果照片欄位留空，前台會退回到 public fallback placeholder，不會讓版面壞掉。"
            />
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="grid gap-5 md:grid-cols-2">
              <Card className="md:col-span-2">
                <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
                  <Image
                    src={content.founder.portraitImageUrl || "/people/founder-portrait.svg"}
                    alt={content.founder.name}
                    width={1200}
                    height={1200}
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                  <div>
                    <h2 className="text-[1.5rem] font-medium text-midnight">{content.founder.name}</h2>
                    <p className="mt-2 text-sm uppercase tracking-[0.14em] text-champagne">{content.founder.role}</p>
                    <div className="prose prose-slate mt-4 text-base" dangerouslySetInnerHTML={{ __html: content.founder.bio }} />
                  </div>
                </div>
              </Card>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <FadeUp>
            <SectionTitle eyebrow="Testimonials" title="合作後留下的三則摘要見證" />
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
