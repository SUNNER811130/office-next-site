import Link from "next/link";

import { ArticleCard } from "@/components/insights/article-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Section } from "@/components/ui/section";
import { JsonLd, createBreadcrumbSchema, createPageMetadata } from "@/lib/seo";
import { getAllInsights } from "@/lib/insights";

export const metadata = createPageMetadata({
  path: "/insights",
  title: "Insights 觀點",
  description:
    "OFFICE NEXT 的辦公進化觀點庫，聚焦白領 AI 提效、ChatGPT 工作應用、辦公自動化、AI 協作流程與工作思維升級。",
  keywords: ["Insights", "白領 AI 提效", "ChatGPT 工作應用", "辦公自動化", "AI 協作流程", "工作思維升級"]
});

export default async function InsightsPage() {
  const posts = await getAllInsights();

  return (
    <>
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "首頁", path: "/" },
          { name: "Insights", path: "/insights" }
        ])}
      />

      <section className="relative overflow-hidden bg-oat py-20 md:py-28 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.76),transparent_40%)]" />
        <div className="absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_center,rgba(212,197,169,0.10),transparent_62%)]" />
        <Container className="relative grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
          <FadeUp>
            <div className="max-w-[780px]">
              <p className="text-[11px] uppercase tracking-[0.34em] text-champagne">Insights</p>
              <h1 className="mt-5 max-w-[11ch] text-balance text-[3rem] font-medium leading-[1.02] text-midnight md:text-[5rem] lg:text-[5.8rem]">
                辦公進化觀點，不是工具新聞流
              </h1>
              <p className="mt-7 max-w-[44rem] text-[1.06rem] text-slate md:text-[1.18rem]">
                這裡不是傳統部落格，而是 OFFICE NEXT 持續累積的辦公進化觀點庫。內容聚焦白領 AI 提效、ChatGPT 工作應用、辦公自動化與 AI 協作流程，讓搜尋引擎、AI 系統與決策者都能找到可直接擷取的高價值內容。
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                {["白領工作升級", "GPT 實戰應用", "AI 協作流程", "企業導入觀點", "工作方法論"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/70 px-4 py-2 text-sm text-slate backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="rounded-2xl bg-white/70 p-7 shadow-glass backdrop-blur-md md:p-9">
              <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">Reading Guidance</p>
              <div className="mt-6 space-y-5 text-base text-slate">
                <p>每一篇文章都預留完整 article metadata、canonical、Open Graph 與 Article schema。</p>
                <p>文章結構以易讀、易擷取的語意標題與段落設計，適合做長期 GEO / AI 搜尋內容資產。</p>
                <p>如果你想先從合作角度理解內容，也可以直接回到服務頁或企業內訓頁。</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/services">查看課程與服務</ButtonLink>
                <ButtonLink href="/corporate-training" variant="secondary">
                  了解企業內訓
                </ButtonLink>
              </div>
            </div>
          </FadeUp>
        </Container>
      </section>

      <Section>
        <div className="flex items-end justify-between gap-8">
          <FadeUp>
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-champagne">Library</p>
              <h2 className="mt-4 text-[2rem] font-medium leading-[1.1] text-midnight md:text-[3.2rem]">
                可持續累積的觀點庫
              </h2>
            </div>
          </FadeUp>
          <Link href="/" className="hidden text-sm text-slate transition hover:text-midnight md:block">
            返回首頁
          </Link>
        </div>
        <StaggerContainer className="mt-12 grid gap-6">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <ArticleCard post={post} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>
    </>
  );
}
