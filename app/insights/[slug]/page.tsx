import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCta } from "@/components/insights/article-cta";
import { ArticleQuickAnswers } from "@/components/insights/quick-answers";
import { KeyTakeaways } from "@/components/insights/key-takeaways";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeUp } from "@/components/ui/motion";
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
  const posts = await getAllInsights();
  return posts.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);

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
  const post = await getInsightBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedInsights(post.slug);

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
        <section className="relative overflow-hidden bg-oat py-20 md:py-28 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.76),transparent_40%)]" />
          <Container className="relative">
            <FadeUp>
              <nav aria-label="文章 breadcrumb" className="mb-10 flex flex-wrap items-center gap-3 text-sm text-slate">
                <Link href="/" className="transition hover:text-midnight">
                  首頁
                </Link>
                <span>/</span>
                <Link href="/insights" className="transition hover:text-midnight">
                  Insights
                </Link>
                <span>/</span>
                <span className="text-midnight">{post.title}</span>
              </nav>

              <div className="grid gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:items-end">
                <div className="max-w-[820px]">
                  <p className="text-[11px] uppercase tracking-[0.34em] text-champagne">{post.category}</p>
                  <h1 className="mt-5 max-w-[12ch] text-balance text-[3rem] font-medium leading-[1.02] text-midnight md:text-[5rem] lg:text-[5.8rem]">
                    {post.title}
                  </h1>
                  <p className="mt-7 max-w-[40rem] text-[1.05rem] text-slate md:text-[1.14rem]">
                    {post.summary}
                  </p>
                  {post.coverImageUrl && (
                    <div className="mt-10 overflow-hidden rounded-2xl shadow-elegant">
                      <img 
                        src={post.coverImageUrl} 
                        alt={post.title} 
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-white/70 p-7 shadow-glass backdrop-blur-md md:p-9">
                  <div className="grid gap-5 text-sm text-slate md:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Published</p>
                      <p className="mt-2">{post.publishedAt}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Updated</p>
                      <p className="mt-2">{post.updatedAt}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Author</p>
                      <p className="mt-2">{post.author}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Reading Time</p>
                      <p className="mt-2">{post.readingTime}</p>
                    </div>
                  </div>
                  <p className="mt-8 border-t border-midnight/8 pt-6 text-base text-slate">{post.heroText}</p>
                </div>
              </div>
            </FadeUp>
          </Container>
        </section>

        <section className="py-20 md:py-24 lg:py-28">
          <Container>
            <div className="grid gap-14 lg:grid-cols-[0.24fr_0.76fr] lg:items-start">
              <aside className="lg:sticky lg:top-28">
                <div className="rounded-2xl bg-white/70 p-6 shadow-glass backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Article Guide</p>
                  <nav aria-label="文章段落導覽" className="mt-5 grid gap-3 text-sm text-slate">
                    <a href="#article-summary" className="transition hover:text-midnight">
                      精準摘要
                    </a>
                    <a href="#article-takeaways" className="transition hover:text-midnight">
                      Key Takeaways
                    </a>
                    {post.bodySections.map((section, index) => (
                      <a
                        key={section.title}
                        href={`#section-${index + 1}`}
                        className="transition hover:text-midnight"
                      >
                        {section.title}
                      </a>
                    ))}
                    <a href="#article-answers" className="transition hover:text-midnight">
                      Quick Answers
                    </a>
                    <a href="#article-links" className="transition hover:text-midnight">
                      相關連結
                    </a>
                  </nav>
                </div>
              </aside>

              <div className="max-w-[780px]">
                <section id="article-summary" className="scroll-mt-28 pb-10">
                  <FadeUp>
                    <div className="rounded-2xl bg-white/70 p-7 shadow-glass backdrop-blur-md md:p-8">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Precision Summary</p>
                      <p className="mt-5 text-[1.08rem] text-slate">{post.summary}</p>
                    </div>
                  </FadeUp>
                </section>

                <section id="article-takeaways" className="scroll-mt-28 pb-10">
                  <FadeUp>
                    <KeyTakeaways items={post.keyTakeaways} />
                  </FadeUp>
                </section>

                {post.htmlContent ? (
                  <section id="article-content" className="scroll-mt-28 border-b border-midnight/8 py-10">
                    <div 
                      className="prose prose-slate prose-lg max-w-none text-slate break-words" 
                      dangerouslySetInnerHTML={{ __html: post.htmlContent }} 
                    />
                  </section>
                ) : (
                  post.bodySections.map((section, index) => (
                    <section
                      id={`section-${index + 1}`}
                      key={section.title}
                      className="scroll-mt-28 border-b border-midnight/8 py-10 first:pt-0 last:border-b-0"
                    >
                      <h2 className="text-[2rem] font-medium leading-[1.12] text-midnight md:text-[2.7rem]">
                        {section.title}
                      </h2>
                      <div className="mt-6 space-y-5 text-[1.04rem] text-slate md:text-[1.08rem]">
                        {section.content.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </section>
                  ))
                )}

                <section id="article-answers" className="scroll-mt-28 py-10">
                  <FadeUp>
                    <ArticleQuickAnswers items={post.quickAnswers} />
                  </FadeUp>
                </section>

                <FadeUp>
                  <section
                    id="article-links"
                    className="scroll-mt-28 rounded-2xl bg-white/70 p-7 shadow-glass backdrop-blur-md md:p-9"
                  >
                    <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">Related Links</p>
                    <h2 className="mt-5 text-[1.7rem] font-medium leading-[1.15] text-midnight md:text-[2.2rem]">
                      延伸閱讀與相關頁面
                    </h2>
                    <div className="mt-7 grid gap-4">
                      {post.relatedLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="rounded-2xl bg-white/60 px-5 py-4 text-base text-slate backdrop-blur-sm transition hover:bg-white/90 hover:text-midnight"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </section>
                </FadeUp>
              </div>
            </div>
          </Container>
        </section>

        <section className="pb-24">
          <Container>
            <FadeUp>
              <ArticleCta
                title={post.cta.title}
                description={post.cta.description}
                primary={post.cta.primary}
                secondary={post.cta.secondary}
              />
            </FadeUp>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/insights/${relatedPost.slug}`}
                  className="rounded-2xl bg-white/70 px-6 py-6 shadow-glass backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-glass-hover"
                >
                  <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">{relatedPost.category}</p>
                  <h3 className="mt-4 text-[1.35rem] font-medium leading-8 text-midnight">
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
