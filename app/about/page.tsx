import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
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

      <Section className="border-b border-ink/6 bg-[#f6f1e9]">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-bronze">About</p>
            <h1 className="mt-5 max-w-[12ch] text-balance text-[2.9rem] font-medium leading-[1.06] text-ink md:text-[4.8rem]">
              {content.founder.tagline}
            </h1>
            <p className="mt-6 max-w-[42rem] text-[1.06rem] text-slate">{content.founder.bio}</p>
            <div className="mt-10 flex gap-3">
              <ButtonLink href="/services">查看服務</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                聯絡 OFFICE NEXT
              </ButtonLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2.4rem] border border-white/70 bg-white/70 p-4 shadow-[0_24px_70px_rgba(17,17,17,0.08)]">
            <img
              src={content.founder.heroImageUrl || "/people/founder-hero.svg"}
              alt={content.founder.name}
              className="aspect-[4/5] w-full rounded-[2rem] object-cover"
            />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionTitle eyebrow="Brand" title={content.brand.name} description={content.brand.summary} />
          <div className="grid gap-5">
            <Card>
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Positioning</p>
              <p className="mt-3 text-[1.06rem] text-slate">{content.brand.positioning}</p>
            </Card>
            <Card>
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Proposition</p>
              <p className="mt-3 text-[1.06rem] text-slate">{content.brand.proposition}</p>
            </Card>
            <Card>
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Founder</p>
              <p className="mt-3 text-[1.2rem] text-ink">{content.founder.name}</p>
              <p className="mt-2 text-sm text-slate">
                {content.founder.role} · {content.founder.tagline}
              </p>
            </Card>
          </div>
        </div>
      </Section>

      <Section surface="muted">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <SectionTitle
            eyebrow="Founder"
            title="主理人資料與照片會直接從後台回寫到前台"
            description="如果照片欄位留空，前台會退回到 public fallback placeholder，不會讓版面壞掉。"
          />
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="md:col-span-2">
              <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
                <img
                  src={content.founder.portraitImageUrl || "/people/founder-portrait.svg"}
                  alt={content.founder.name}
                  className="aspect-square w-full rounded-[1.8rem] object-cover"
                />
                <div>
                  <h2 className="text-[1.5rem] font-medium text-ink">{content.founder.name}</h2>
                  <p className="mt-2 text-sm uppercase tracking-[0.14em] text-bronze">{content.founder.role}</p>
                  <p className="mt-4 text-base text-slate">{content.founder.bio}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <SectionTitle eyebrow="Testimonials" title="合作後留下的三則摘要見證" />
          <div className="grid gap-5">
            {content.testimonials.items.map((item) => (
              <Card key={`${item.name}-${item.company}`}>
                <p className="text-lg text-ink">“{item.quote}”</p>
                <p className="mt-5 text-sm text-slate">
                  {item.name} · {item.role} · {item.company}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <SectionTitle eyebrow="FAQ" title="關於 OFFICE NEXT 的常見問題" />
          <FaqAccordion items={content.faq.items} firstOpen />
        </div>
      </Section>
    </>
  );
}
