import { AboutPageContent } from "@/components/public-pages/about-page-content";
import { readContent } from "@/lib/content-store";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const content = await readContent();
  return createPageMetadata({
    path: "/about",
    title: "關於 OFFICE NEXT 辦公進化所",
    description: `${content.brand.summary} ${content.founder.tagline}`,
    keywords: [content.brand.name, content.founder.name, "白領 AI 工作升級教練", "辦公自動化", "ChatGPT 工作應用", "工作流程升級"]
  });
}

export default async function AboutPage() {
  return <AboutPageContent content={await readContent()} />;
}
