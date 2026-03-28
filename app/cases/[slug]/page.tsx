import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
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
          <header className="bg-[#f6f1e9] pt-16 pb-20 md:pt-24 md:pb-28">
            <Container className="max-w-4xl border-b border-ink/10 pb-16">
              <nav aria-label="Breadcumb" className="mb-10 text-sm text-slate">
                <Link href="/" className="hover:text-ink transition">首頁</Link> &gt;{" "}
                <Link href="/cases" className="hover:text-ink transition">案例研究</Link> &gt;{" "}
                <span className="text-ink">{post.title}</span>
              </nav>

              <h1 className="text-balance text-[2.5rem] font-medium leading-[1.1] text-ink md:text-[4rem]">
                {post.title}
              </h1>

              <div className="mt-8 flex items-center gap-4 text-sm font-medium text-slate uppercase tracking-[0.2em]">
                <span>{post.publishedAt}</span>
              </div>

              {post.coverImageUrl && (
                <figure className="mt-14 overflow-hidden rounded-[2rem] shadow-xl border border-ink/5">
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
              )}
            </Container>
          </header>

          <Container className="max-w-4xl mt-16 md:mt-24">
            {/* GEO Optimized Data Structure */}
            <div className="grid gap-12 md:gap-16">
              <section aria-labelledby="executive-summary" className="rounded-[2.4rem] border border-ink/8 bg-gradient-to-b from-white/94 to-[#f7f1e9]/98 p-8 md:p-12 shadow-[0_22px_58px_rgba(17,17,17,0.03)]">
                <h2 id="executive-summary" className="text-[1.8rem] font-medium text-ink md:text-[2.2rem]">
                  Executive Summary 執行摘要
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate md:text-xl md:leading-[1.8]">
                  {post.executiveSummary}
                </p>
              </section>

              <section aria-labelledby="challenge">
                <h2 id="challenge" className="text-[1.8rem] border-b border-bronze/30 pb-4 font-medium text-ink md:text-[2.2rem]">
                  Challenge 面臨挑戰
                </h2>
                <p className="mt-6 text-[1.1rem] leading-[1.8] text-slate">
                  {post.challenge}
                </p>
              </section>

              <section aria-labelledby="solution">
                <h2 id="solution" className="text-[1.8rem] border-b border-bronze/30 pb-4 font-medium text-ink md:text-[2.2rem]">
                  Solution 解決方案
                </h2>
                <p className="mt-6 text-[1.1rem] leading-[1.8] text-slate">
                  {post.solution}
                </p>
              </section>

              <section aria-labelledby="results" className="rounded-[2.4rem] bg-ink text-paper p-8 md:p-12">
                <h2 id="results" className="text-[1.8rem] font-medium md:text-[2.2rem]">
                  Results 成效數據
                </h2>
                <ul className="mt-8 grid gap-4 space-y-4">
                  {post.results.map((result, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bronze/20 text-bronze font-bold text-sm">
                        {idx + 1}
                      </div>
                      <p className="pt-1 text-lg font-medium leading-relaxed md:text-xl">
                        {result}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              {post.htmlContent && (
                <section aria-labelledby="additional-details" className="pt-8 border-t border-ink/10">
                  <h3 id="additional-details" className="sr-only">詳細說明</h3>
                  <div 
                    className="prose prose-slate prose-lg max-w-none text-slate"
                    dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                  />
                </section>
              )}
            </div>
          </Container>
        </article>
      </main>
    </>
  );
}
