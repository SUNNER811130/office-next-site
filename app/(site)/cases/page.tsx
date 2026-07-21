import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { SectionTitle } from "@/components/ui/section-title";
import { getAllCases } from "@/lib/cases";


export const metadata = {
  title: "辦公 AI 提效案例 - OFFICE NEXT",
  description: "了解 OFFICE NEXT 如何協助白領與企業團隊導入 ChatGPT 工作應用、辦公自動化與 AI 工作流程，降低重複工作並提升流程品質。",
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
          <FadeUp>
            <SectionTitle 
              eyebrow="Case Studies"
              title="辦公 AI 提效案例"
              description="透過會議紀錄、資料整理、表單流程、報表彙整與團隊協作案例，理解 AI 如何回到白領日常工作流程。"
              align="center"
            />
          </FadeUp>

          <StaggerContainer className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((post) => (
              <StaggerItem key={post.slug}>
                <Link
                  href={`/cases/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white/70 shadow-glass backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-glass-hover"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-oat">
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
                    <p className="text-[11px] uppercase tracking-[0.2em] text-champagne">{post.publishedAt}</p>
                    <h3 className="mt-3 text-xl font-medium leading-normal text-midnight">{post.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate">{post.executiveSummary}</p>
                    <div className="mt-auto pt-6 flex w-fit items-center gap-2 text-sm font-medium text-midnight transition group-hover:text-champagne">
                      閱讀案例 &rarr;
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </main>
    </>
  );
}
