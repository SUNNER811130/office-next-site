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
  return createPageMetadata({
    path: "/services",
    title: "課程與服務｜ChatGPT 工作應用、GAS 辦公降載與 Agent 高效槓桿",
    description:
      "OFFICE NEXT 課程與服務包含 GPT 提示詞工坊、GAS 辦公降載、Agent 高效槓桿與企業 AI 內訓，協助白領升級日常辦公流程。",
    keywords: [
      "GPT 智慧工作模組",
      "ChatGPT 工作應用",
      "GAS 辦公降載",
      "Agent 高效槓桿",
      "企業 AI 內訓",
      "辦公自動化"
    ]
  });
}

export default async function ServicesPage() {
  const content = await readContent();

  return (
    <>
      <JsonLd
        data={[
          createBreadcrumbSchema([
            { name: "首頁", path: "/" },
            { name: "服務方向", path: "/services" }
          ]),
          createFaqSchema(content.faq.items)
        ]}
      />

      <Section className="bg-oat">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.92fr] lg:items-end">
          <FadeUp>
            <p className="text-[11px] uppercase tracking-[0.34em] text-champagne">Services</p>
            <h1 className="mt-5 max-w-[14ch] text-balance text-[clamp(2.3rem,4.8vw,4.25rem)] font-medium leading-[1.1] text-midnight">
              從 ChatGPT 到自動化，建立你的 AI 辦公流程
            </h1>
            <p className="mt-7 max-w-[43rem] text-[1.06rem] text-slate">{content.brand.proposition}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
              <ButtonLink href="/contact">提出合作需求</ButtonLink>
              <ButtonLink href="/about" variant="secondary">
                查看主理人
              </ButtonLink>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <Card>
              <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Service Snapshot</p>
              <div className="mt-5 grid gap-4">
                {content.services.items.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-white/60 px-4 py-4 backdrop-blur-sm">
                    <p className="font-medium text-midnight">{item.title}</p>
                    <p className="mt-2 text-sm text-slate">{item.audience}</p>
                  </div>
                ))}
              </div>
            </Card>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <StaggerContainer className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" stagger={0.1}>
          {content.services.items.map((item, index) => (
            <StaggerItem key={item.title}>
              <Card className="service-tech-card h-full">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.title} width={1600} height={1200} className="aspect-[4/3] w-full rounded-2xl object-cover" />
                ) : null}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-champagne">Module 0{index + 1}</p>
                  <span className="rounded-full border border-champagne/30 bg-champagne/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-champagne">Unlock</span>
                </div>
                <h2 className="mt-4 text-[1.3rem] font-medium leading-8 text-midnight md:text-[1.45rem]">{item.title}</h2>
                <p className="mt-3 text-[0.95rem] leading-7 text-slate md:text-base">{item.description}</p>
                <p className="mt-5 border-t border-midnight/8 pt-5 text-sm text-slate">{item.audience}</p>
                {item.ctaLabel && item.ctaHref ? (
                  <ButtonLink
                    href={item.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`前往「${item.title}」報名表單，另開新視窗`}
                    className="mt-6 max-w-full text-center"
                  >
                    {item.ctaLabel}
                  </ButtonLink>
                ) : null}
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      <Section surface="muted">
        <div className="grid gap-10">
          <FadeUp>
            <SectionTitle
              eyebrow="Case Snapshots"
              title="服務會回到真實辦公場景，從會議、資料、表單與團隊協作開始"
            />
          </FadeUp>
          <StaggerContainer className="grid gap-5 lg:grid-cols-3">
            {content.cases.items.map((item) => (
              <StaggerItem key={item.title}>
                <Card>
                  <Image
                    src={item.imageUrl || "/sections/strategy-session-01.svg"}
                    alt={item.title}
                    width={1600}
                    height={1200}
                    className="aspect-[4/3] w-full rounded-2xl object-cover"
                  />
                  <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-champagne">{item.category}</p>
                  <h3 className="mt-4 text-[1.35rem] font-medium text-midnight">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate">{item.problem}</p>
                  <p className="mt-3 text-sm text-slate">{item.approach}</p>
                  <p className="mt-3 text-sm text-slate">{item.result}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      <Section className="pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <FadeUp>
            <SectionTitle eyebrow="FAQ" title="服務合作常見問題" />
          </FadeUp>
          <FadeUp delay={0.15}>
            <FaqAccordion items={content.faq.items} firstOpen />
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
