import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCta } from "@/components/insights/article-cta";
import { ArticleQuickAnswers } from "@/components/insights/quick-answers";
import { KeyTakeaways } from "@/components/insights/key-takeaways";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  JsonLd,
  createArticleMetadata,
  createArticleSchema,
  createBreadcrumbSchema,
  createFaqSchema
} from "@/lib/seo";
import { getAllInsights, getInsightBySlug, getRelatedInsights } from "@/lib/insights";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getAllInsights().map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getInsightBySlug(slug);

  if (!post) {
    return {};
  }

  return createArticleMetadata({
    path: `/insights/${post.slug}`,
    title: post.title,
    description: post.summary,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
    keywords: [post.category, post.author, "Insights", "AI 搜尋友好內容"]
  });
}

export default async function InsightArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getInsightBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedInsights(post.slug);

  return (
    <>
      <JsonLd
        data={[
          createBreadcrumbSchema([
            { name: "首頁", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: post.title, path: `/insights/${post.slug}` }
          ]),
          createArticleSchema({
            path: `/insights/${post.slug}`,
            title: post.title,
            description: post.summary,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            author: post.author
          }),
          createFaqSchema(post.quickAnswers)
        ]}
      />

      <article>
        <section className="relative overflow-hidden border-b border-ink/6 bg-[#f6f1e9] py-20 md:py-28 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.76),transparent_40%)]" />
          <Container className="relative">
            <nav aria-label="文章 breadcrumb" className="mb-10 flex flex-wrap items-center gap-3 text-sm text-slate">
              <Link href="/" className="transition hover:text-ink">
                首頁
              </Link>
              <span>/</span>
              <Link href="/insights" className="transition hover:text-ink">
                Insights
              </Link>
              <span>/</span>
              <span className="text-ink">{post.title}</span>
            </nav>

            <div className="grid gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:items-end">
              <div className="max-w-[820px]">
                <p className="text-[11px] uppercase tracking-[0.34em] text-bronze">{post.category}</p>
                <h1 className="mt-5 max-w-[12ch] text-balance text-[3rem] font-medium leading-[1.02] text-ink md:text-[5rem] lg:text-[5.8rem]">
                  {post.title}
                </h1>
                <p className="mt-7 max-w-[40rem] text-[1.05rem] text-slate md:text-[1.14rem]">
                  {post.summary}
                </p>
              </div>

              <div className="rounded-[2.5rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(248,242,233,0.94))] p-7 shadow-[0_28px_72px_rgba(17,17,17,0.08)] md:p-9">
                <div className="grid gap-5 text-sm text-slate md:grid-cols-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Published</p>
                    <p className="mt-2">{post.publishedAt}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Updated</p>
                    <p className="mt-2">{post.updatedAt}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Author</p>
                    <p className="mt-2">{post.author}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Reading Time</p>
                    <p className="mt-2">{post.readingTime}</p>
                  </div>
                </div>
                <p className="mt-8 border-t border-ink/8 pt-6 text-base text-slate">{post.heroText}</p>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-20 md:py-24 lg:py-28">
          <Container>
            <div className="grid gap-14 lg:grid-cols-[0.24fr_0.76fr] lg:items-start">
              <aside className="lg:sticky lg:top-28">
                <div className="rounded-[2rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,241,233,0.96))] p-6 shadow-[0_20px_55px_rgba(17,17,17,0.05)]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Article Guide</p>
                  <nav aria-label="文章段落導覽" className="mt-5 grid gap-3 text-sm text-slate">
                    <a href="#article-summary" className="transition hover:text-ink">
                      精準摘要
                    </a>
                    <a href="#article-takeaways" className="transition hover:text-ink">
                      Key Takeaways
                    </a>
                    {post.bodySections.map((section, index) => (
                      <a
                        key={section.title}
                        href={`#section-${index + 1}`}
                        className="transition hover:text-ink"
                      >
                        {section.title}
                      </a>
                    ))}
                    <a href="#article-answers" className="transition hover:text-ink">
                      Quick Answers
                    </a>
                    <a href="#article-links" className="transition hover:text-ink">
                      相關連結
                    </a>
                  </nav>
                </div>
              </aside>

              <div className="max-w-[780px]">
                <section id="article-summary" className="scroll-mt-28 pb-10">
                  <div className="rounded-[2.4rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,233,0.98))] p-7 shadow-[0_22px_58px_rgba(17,17,17,0.05)] md:p-8">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Precision Summary</p>
                    <p className="mt-5 text-[1.08rem] text-slate">{post.summary}</p>
                  </div>
                </section>

                <section id="article-takeaways" className="scroll-mt-28 pb-10">
                  <KeyTakeaways items={post.keyTakeaways} />
                </section>

                {post.bodySections.map((section, index) => (
                  <section
                    id={`section-${index + 1}`}
                    key={section.title}
                    className="scroll-mt-28 border-b border-ink/8 py-10 first:pt-0 last:border-b-0"
                  >
                    <h2 className="text-[2rem] font-medium leading-[1.12] text-ink md:text-[2.7rem]">
                      {section.title}
                    </h2>
                    <div className="mt-6 space-y-5 text-[1.04rem] text-slate md:text-[1.08rem]">
                      {section.content.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}

                <section id="article-answers" className="scroll-mt-28 py-10">
                  <ArticleQuickAnswers items={post.quickAnswers} />
                </section>

                <section
                  id="article-links"
                  className="scroll-mt-28 rounded-[2.6rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,241,233,0.98))] p-7 shadow-[0_24px_64px_rgba(17,17,17,0.06)] md:p-9"
                >
                  <p className="text-[11px] uppercase tracking-[0.3em] text-bronze">Related Links</p>
                  <h2 className="mt-5 text-[1.7rem] font-medium leading-[1.15] text-ink md:text-[2.2rem]">
                    延伸閱讀與相關頁面
                  </h2>
                  <div className="mt-7 grid gap-4">
                    {post.relatedLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-[1.5rem] border border-ink/8 bg-white/70 px-5 py-4 text-base text-slate transition hover:border-ink/14 hover:bg-white hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </Container>
        </section>

        <section className="pb-24">
          <Container>
            <ArticleCta
              title={post.cta.title}
              description={post.cta.description}
              primary={post.cta.primary}
              secondary={post.cta.secondary}
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/insights/${relatedPost.slug}`}
                  className="rounded-[2rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,241,233,0.98))] px-6 py-6 shadow-[0_20px_54px_rgba(17,17,17,0.05)] transition hover:-translate-y-0.5 hover:border-ink/14 hover:shadow-[0_26px_66px_rgba(17,17,17,0.08)]"
                >
                  <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">{relatedPost.category}</p>
                  <h3 className="mt-4 text-[1.35rem] font-medium leading-8 text-ink">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-4 text-sm text-slate">{relatedPost.summary}</p>
                </Link>
              ))}
            </div>

            <div className="mt-10">
              <ButtonLink href="/insights" variant="secondary">
                返回 Insights 觀點庫
              </ButtonLink>
            </div>
          </Container>
        </section>
      </article>
    </>
  );
}
