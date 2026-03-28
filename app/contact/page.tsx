import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { readContent } from "@/lib/content-store";
import { JsonLd, createBreadcrumbSchema, createFaqSchema, createPageMetadata } from "@/lib/seo";

function getSocialLinks(content: Awaited<ReturnType<typeof readContent>>) {
  return [
    { label: "LinkedIn", url: content.social.linkedin },
    { label: "Facebook", url: content.social.facebook },
    { label: "Instagram", url: content.social.instagram },
    { label: "Threads", url: content.social.threads },
    { label: "YouTube", url: content.social.youtube },
    { label: "X", url: content.social.x },
    ...content.social.other
  ].filter((item) => item.url);
}

export async function generateMetadata() {
  const content = await readContent();
  return createPageMetadata({
    path: "/contact",
    title: "聯絡 OFFICE NEXT",
    description: content.contact.intro,
    keywords: ["聯絡", "OFFICE NEXT", content.contact.email]
  });
}

export default async function ContactPage() {
  const content = await readContent();
  const socialLinks = getSocialLinks(content);

  return (
    <>
      <JsonLd
        data={[
          createBreadcrumbSchema([
            { name: "首頁", path: "/" },
            { name: "聯絡", path: "/contact" }
          ]),
          createFaqSchema(content.faq.items)
        ]}
      />

      <Section className="bg-oat">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <FadeUp>
            <SectionTitle
              eyebrow="Contact"
              title={content.contact.intro}
              description={content.contact.responseExpectation}
            />
          </FadeUp>
          <FadeUp delay={0.15}>
            <Card>
              <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Contact Snapshot</p>
              <div className="mt-5 grid gap-4">
                <div className="rounded-2xl bg-white/60 px-4 py-4 backdrop-blur-sm">
                  <p className="text-sm text-slate">Email</p>
                  <Link href={`mailto:${content.contact.email}`} className="mt-2 block text-lg font-medium text-midnight">
                    {content.contact.email}
                  </Link>
                </div>
                <div className="rounded-2xl bg-white/60 px-4 py-4 backdrop-blur-sm">
                  <p className="text-sm text-slate">Inquiry Options</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {content.contact.inquiryOptions.map((item) => (
                      <span key={item} className="rounded-full bg-oat px-3 py-2 text-sm text-slate">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <FadeUp>
            <Card>
              <p className="text-sm uppercase tracking-[0.3em] text-champagne">Start a Conversation</p>
              <h2 className="mt-6 text-[1.8rem] font-medium leading-[1.15] text-midnight">最快的方式是直接寄信</h2>
              <p className="mt-4 text-base text-slate">{content.contact.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`mailto:${content.contact.email}`}>{content.contact.mailtoLabel}</ButtonLink>
                <ButtonLink href="/services" variant="secondary">
                  先看服務內容
                </ButtonLink>
              </div>
              <div className="mt-8 rounded-2xl bg-oat/60 px-5 py-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Response Expectation</p>
                <p className="mt-3 text-sm text-slate">{content.contact.responseExpectation}</p>
              </div>
            </Card>
          </FadeUp>

          <StaggerContainer className="grid gap-5">
            <StaggerItem>
              <Card>
                <p className="text-sm uppercase tracking-[0.3em] text-champagne">Brand Entity Note</p>
                <div className="mt-6 space-y-4 text-base text-slate">
                  <p>{content.brand.summary}</p>
                  <p>{content.brand.positioning}</p>
                  <p>{content.brand.proposition}</p>
                </div>
              </Card>
            </StaggerItem>

            {socialLinks.length > 0 ? (
              <StaggerItem>
                <Card>
                  <p className="text-sm uppercase tracking-[0.3em] text-champagne">Social Links</p>
                  <div className="mt-6 flex flex-wrap gap-3 text-base text-slate">
                    {socialLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.url}
                        className="rounded-full bg-oat px-4 py-2 transition hover:bg-champagne/20 hover:text-midnight"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </Card>
              </StaggerItem>
            ) : null}
          </StaggerContainer>
        </div>
      </Section>

      <Section className="pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <FadeUp>
            <SectionTitle eyebrow="FAQ" title="聯絡前常見問題" />
          </FadeUp>
          <FadeUp delay={0.15}>
            <FaqAccordion items={content.faq.items} firstOpen />
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
