import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { getAllCases } from "@/lib/cases";


export const metadata = {
  title: "客戶案例 Case Studies - OFFICE NEXT",
  description: "了解 OFFICE NEXT 如何協助頂尖企業成功導入 AI 與自動化流程，解決痛點並放大百倍效益。",
};

export default async function CasesPage() {
  const cases = (await getAllCases()) || [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": cases.map((c, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "url": `https://office-next-site.vercel.app/cases/${c.slug}`,
              "name": c.title,
              "description": c.executiveSummary
            }))
          })
        }}
      />
      
      <main className="pt-32 pb-24 md:pt-40 md:pb-32">
        <Container>
          <SectionTitle 
            eyebrow="Case Studies"
            title="成功案例與導入實績"
            description="透過真實數據與執行框架，解答您對於引入創新工作流程的疑慮與期待。"
            align="center"
          />

          <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((post) => (
              <Link
                key={post.slug}
                href={`/cases/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-ink/8 bg-white/60 transition hover:-translate-y-1 hover:border-ink/15 hover:shadow-xl"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink/5">
                  {post.coverImageUrl && (
                    <Image
                      src={post.coverImageUrl}
                      alt={post.imageAltText || post.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-bronze">{post.publishedAt}</p>
                  <h3 className="mt-3 text-xl font-medium leading-normal text-ink">{post.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate">{post.executiveSummary}</p>
                  <div className="mt-auto pt-6 flex w-fit items-center gap-2 text-sm font-medium text-ink transition group-hover:text-bronze">
                    閱讀案例範本 &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
