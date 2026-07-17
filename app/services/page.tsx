import { ServicesPageContent } from "@/components/public-pages/services-page-content";
import { readContent } from "@/lib/content-store";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createPageMetadata({
    path: "/services",
    title: "課程與服務｜ChatGPT 工作應用、GAS 辦公降載與 Agent 高效槓桿",
    description: "OFFICE NEXT 課程與服務包含 GPT 提示詞工坊、GAS 辦公降載、Agent 高效槓桿與企業 AI 內訓，協助白領升級日常辦公流程。",
    keywords: ["GPT 智慧工作模組", "ChatGPT 工作應用", "GAS 辦公降載", "Agent 高效槓桿", "企業 AI 內訓", "辦公自動化"]
  });
}

export default async function ServicesPage() {
  return <ServicesPageContent content={await readContent()} />;
}
