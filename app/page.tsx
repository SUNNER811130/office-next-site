import { HomePageContent } from "@/components/public-pages/home-page-content";
import { readContent } from "@/lib/content-store";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createPageMetadata({
    path: "/",
    title: "白領 AI 提效與辦公自動化",
    description: "OFFICE NEXT 辦公進化所聚焦 ChatGPT 工作應用、辦公自動化與 AI 工作流程，協助白領把重複工作交給 AI，升級日常流程並準時下班。",
    keywords: ["白領 AI 提效", "辦公自動化", "ChatGPT 工作應用", "AI 工作流程", "準時下班", "會議紀錄自動化", "資料整理", "提案摘要", "報表彙整"]
  });
}

export default async function HomePage() {
  return <HomePageContent content={await readContent()} />;
}
