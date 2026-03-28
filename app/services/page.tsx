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
    path: "/services",
    title: "服務方向",
    description: content.brand.proposition,
    keywords: ["服務方向", "AI 導入", "品牌策略", "工作坊"]
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
            <h1 className="mt-5 max-w-[11ch] text-balance text-[2.9rem] font-medium leading-[1.06] text-midnight md:text-[4.8rem]">
              服務方向與案例摘要由後台統一管理
            </h1>
            <p className="mt-7 max-w-[43rem] text-[1.06rem] text-slate">{content.brand.proposition}</p>
            <div className="mt-10 flex gap-3">
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
        <StaggerContainer className="grid gap-5 lg:grid-cols-3">
          {content.services.items.map((item) => (
            <StaggerItem key={item.title}>
              <Card>
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.title} width={1600} height={1200} className="aspect-[4/3] w-full rounded-2xl object-cover" />
                ) : null}
                <h2 className="mt-5 text-[1.45rem] font-medium text-midnight">{item.title}</h2>
                <p className="mt-4 text-base text-slate">{item.description}</p>
                <p className="mt-5 border-t border-midnight/8 pt-5 text-sm text-slate">{item.audience}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      <Section surface="muted">
        <div className="grid gap-10">
          <FadeUp>
            <SectionTitle eyebrow="Case Snapshots" title="每個服務方向都可以被案例摘要與圖像支撐" />
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
