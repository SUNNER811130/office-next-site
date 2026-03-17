import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
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

      <section className="relative overflow-hidden border-b border-ink/6 bg-paper">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),transparent_38%)]" />
        <div className="absolute inset-y-0 right-0 w-[44%] bg-[radial-gradient(circle_at_center,rgba(131,104,74,0.12),transparent_62%)]" />
        <Container className="relative grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_0.94fr] lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-bronze">{content.home.hero.eyebrow}</p>
            <h1 className="mt-6 max-w-[11ch] text-balance text-[3rem] font-medium leading-[0.98] text-ink md:text-[5.2rem]">
              {content.home.hero.title}
            </h1>
            <p className="mt-7 max-w-[42rem] text-[1.05rem] text-slate md:text-[1.18rem]">
              {content.home.hero.description}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={content.home.hero.ctaPrimaryHref}>{content.home.hero.ctaPrimaryLabel}</ButtonLink>
              <ButtonLink href={content.home.hero.ctaSecondaryHref} variant="secondary">
                {content.home.hero.ctaSecondaryLabel}
              </ButtonLink>
            </div>
            <div className="mt-12 grid gap-4 border-t border-ink/8 pt-6 md:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Brand</p>
                <p className="mt-2 text-sm leading-7 text-slate">{content.brand.summary}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Positioning</p>
                <p className="mt-2 text-sm leading-7 text-slate">{content.brand.positioning}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Founder</p>
                <p className="mt-2 text-sm leading-7 text-slate">{content.founder.tagline}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.8rem] bg-[#e7ddd1]" />
            <div className="relative overflow-hidden rounded-[2.8rem] border border-white/70 bg-white/70 p-4 shadow-[0_28px_90px_rgba(17,17,17,0.12)]">
              <img
                src={content.home.hero.imageUrl || "/sections/advisory-01.svg"}
                alt={content.home.hero.title}
                className="aspect-[4/5] w-full rounded-[2rem] object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <SectionTitle
            eyebrow="Brand Proposition"
            title="把抽象方向整理成可執行的前台與後台"
            description={content.brand.proposition}
          />
          <div className="grid gap-5">
            {content.home.propositionCards.map((item) => (
              <Card key={item.title}>
                <h3 className="text-[1.3rem] font-medium text-ink">{item.title}</h3>
                <p className="mt-4 text-base text-slate">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section surface="muted">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <SectionTitle
            eyebrow="Pain Points"
            title="常見的斷點通常不是缺工具，而是缺一條清楚主線"
            description="以下內容會直接由後台管理，首頁與其他頁面共用同一份 content store。"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {content.home.painPoints.map((item, index) => (
              <Card key={item}>
                <p className="font-serif text-3xl italic leading-none text-bronze">0{index + 1}</p>
                <p className="mt-8 text-[1.05rem] text-slate">{item}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          {content.services.items.map((service) => (
            <Card key={service.title}>
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="aspect-[4/3] w-full rounded-[1.6rem] object-cover"
                />
              ) : null}
              <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-bronze">Service Direction</p>
              <h3 className="mt-4 text-[1.45rem] font-medium text-ink">{service.title}</h3>
              <p className="mt-4 text-base text-slate">{service.description}</p>
              <p className="mt-5 border-t border-ink/8 pt-5 text-sm text-slate">{service.audience}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section surface="muted">
        <div className="grid gap-10">
          <SectionTitle
            eyebrow="Flagship Modules"
            title="首頁模組與區塊圖全部由同一份內容資料驅動"
            description="上傳新的區塊圖後，只要把 URL 寫回內容資料，前台會直接吃到最新版本。"
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {content.home.flagshipModules.map((module) => (
              <Card key={module.title}>
                <img
                  src={module.imageUrl || "/sections/strategy-session-01.svg"}
                  alt={module.title}
                  className="aspect-[4/3] w-full rounded-[1.6rem] object-cover"
                />
                <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-bronze">{module.eyebrow}</p>
                <h3 className="mt-4 text-[1.35rem] font-medium text-ink">{module.title}</h3>
                <p className="mt-3 text-sm uppercase tracking-[0.12em] text-slate">{module.summary}</p>
                <p className="mt-4 text-base text-slate">{module.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10">
          <SectionTitle
            eyebrow="Cases"
            title="案例摘要與配圖同樣走 content store"
            description="這裡的圖片、問題、方法與結果，都能直接在後台更新。"
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {content.cases.items.map((item) => (
              <Card key={item.title}>
                <img
                  src={item.imageUrl || "/sections/advisory-01.svg"}
                  alt={item.title}
                  className="aspect-[4/3] w-full rounded-[1.6rem] object-cover"
                />
                <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-bronze">{item.category}</p>
                <h3 className="mt-4 text-[1.35rem] font-medium text-ink">{item.title}</h3>
                <p className="mt-4 text-sm text-slate">
                  <strong className="text-ink">Problem:</strong> {item.problem}
                </p>
                <p className="mt-3 text-sm text-slate">
                  <strong className="text-ink">Approach:</strong> {item.approach}
                </p>
                <p className="mt-3 text-sm text-slate">
                  <strong className="text-ink">Result:</strong> {item.result}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {content.clientLogos.length > 0 ? (
        <Section surface="muted">
          <div className="grid gap-8">
            <SectionTitle eyebrow="Client Logos" title="客戶標識區塊可隨內容資料隱藏或更新" />
            <div className="grid gap-4 md:grid-cols-3">
              {content.clientLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="flex items-center justify-center rounded-[1.8rem] border border-ink/8 bg-white/80 p-8"
                >
                  <img
                    src={logo.url || "/logos/client-01.svg"}
                    alt={logo.name}
                    className="h-12 w-auto max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionTitle
            eyebrow="Testimonials"
            title="見證與 logo 也走同一套內容來源"
            description="如果 logo 或 avatar 留空，前台會自動退回純文字呈現，不顯示多餘 placeholder。"
          />
          <div className="grid gap-5">
            {content.testimonials.items.map((item) => (
              <Card key={`${item.name}-${item.company}`}>
                <p className="text-lg leading-8 text-ink">“{item.quote}”</p>
                <div className="mt-6 flex items-center gap-4">
                  {item.avatarUrl ? (
                    <img src={item.avatarUrl} alt={item.name} className="h-14 w-14 rounded-full object-cover" />
                  ) : item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.company}
                      className="h-10 w-auto max-w-[120px] object-contain"
                    />
                  ) : null}
                  <div>
                    <p className="font-medium text-ink">{item.name}</p>
                    <p className="text-sm text-slate">
                      {item.role} · {item.company}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <SectionTitle eyebrow="FAQ" title="常見問題" description={content.contact.responseExpectation} />
          <FaqAccordion items={content.faq.items} firstOpen />
        </div>
      </Section>
    </>
  );
}
