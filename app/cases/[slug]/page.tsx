import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { getAllCases, getCaseBySlug } from "@/lib/cases";

export async function generateStaticParams() {
  const posts = await getAllCases();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getCaseBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} - Case Studies | OFFICE NEXT`,
    description: post.executiveSummary,
    openGraph: {
      title: post.title,
      description: post.executiveSummary,
      images: [post.coverImageUrl]
    }
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getCaseBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://office-next-site.vercel.app/cases/${post.slug}`
    },
    "headline": post.title,
    "description": post.executiveSummary,
    "image": post.coverImageUrl,
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Organization",
      "name": "OFFICE NEXT",
      "url": "https://office-next-site.vercel.app/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OFFICE NEXT",
      "logo": {
        "@type": "ImageObject",
        "url": "https://office-next-site.vercel.app/logo.png"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="pt-24 pb-20 md:pt-32 md:pb-28">
        <article>
          <header className="bg-oat pt-16 pb-20 md:pt-24 md:pb-28">
            <Container className="max-w-4xl pb-16">
              <FadeUp>
                <nav aria-label="Breadcumb" className="mb-10 text-sm text-slate">
                  <Link href="/" className="hover:text-midnight transition">首頁</Link> &gt;{" "}
                  <Link href="/cases" className="hover:text-midnight transition">案例研究</Link> &gt;{" "}
                  <span className="text-midnight">{post.title}</span>
                </nav>

                <h1 className="text-balance text-[2.5rem] font-medium leading-[1.1] text-midnight md:text-[4rem]">
                  {post.title}
                </h1>

                <div className="mt-8 flex items-center gap-4 text-sm font-medium text-slate uppercase tracking-[0.2em]">
                  <span>{post.publishedAt}</span>
                </div>
              </FadeUp>

              {post.coverImageUrl && (
                <FadeUp delay={0.2}>
                  <figure className="mt-14 overflow-hidden rounded-2xl shadow-elegant">
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={post.coverImageUrl}
                        alt={post.imageAltText || "Case Study cover image"}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1200px) 100vw, 1200px"
                      />
                    </div>
                    {post.imageAltText && (
                      <figcaption className="sr-only">{post.imageAltText}</figcaption>
                    )}
                  </figure>
                </FadeUp>
              )}
            </Container>
          </header>

          <Container className="max-w-4xl mt-16 md:mt-24">
            {/* GEO Optimized Data Structure */}
            <StaggerContainer className="grid gap-12 md:gap-16">
              <StaggerItem>
                <section aria-labelledby="executive-summary" className="rounded-2xl bg-white/70 p-8 md:p-12 shadow-glass backdrop-blur-md">
                  <h2 id="executive-summary" className="text-[1.8rem] font-medium text-midnight md:text-[2.2rem]">
                    Executive Summary 執行摘要
                  </h2>
                  <p className="mt-5 text-lg leading-relaxed text-slate md:text-xl md:leading-[1.8]">
                    {post.executiveSummary}
                  </p>
                </section>
              </StaggerItem>

              <StaggerItem>
                <section aria-labelledby="challenge">
                  <h2 id="challenge" className="text-[1.8rem] border-b border-champagne/40 pb-4 font-medium text-midnight md:text-[2.2rem]">
                    Challenge 面臨挑戰
                  </h2>
                  <p className="mt-6 text-[1.1rem] leading-[1.8] text-slate">
                    {post.challenge}
                  </p>
                </section>
              </StaggerItem>

              <StaggerItem>
                <section aria-labelledby="solution">
                  <h2 id="solution" className="text-[1.8rem] border-b border-champagne/40 pb-4 font-medium text-midnight md:text-[2.2rem]">
                    Solution 解決方案
                  </h2>
                  <p className="mt-6 text-[1.1rem] leading-[1.8] text-slate">
                    {post.solution}
                  </p>
                </section>
              </StaggerItem>

              <StaggerItem>
                <section aria-labelledby="results" className="rounded-2xl bg-midnight text-white p-8 md:p-12">
                  <h2 id="results" className="text-[1.8rem] font-medium md:text-[2.2rem]">
                    Results 成效數據
                  </h2>
                  <ul className="mt-8 grid gap-4 space-y-4">
                    {post.results.map((result, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-champagne/20 text-champagne font-bold text-sm">
                          {idx + 1}
                        </div>
                        <p className="pt-1 text-lg font-medium leading-relaxed md:text-xl">
                          {result}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </StaggerItem>

              {post.htmlContent && (
                <StaggerItem>
                  <section aria-labelledby="additional-details" className="pt-8 border-t border-midnight/8">
                    <h3 id="additional-details" className="sr-only">詳細說明</h3>
                    <div 
                      className="prose prose-slate prose-lg max-w-none text-slate"
                      dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                    />
                  </section>
                </StaggerItem>
              )}
            </StaggerContainer>
          </Container>
        </article>
      </main>
    </>
  );
}
