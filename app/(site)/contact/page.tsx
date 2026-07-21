import { ContactPageContent } from "@/components/public-pages/contact-page-content";
import { readContent } from "@/lib/content-store";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const content = await readContent();
  return createPageMetadata({
    path: "/contact",
    title: "聯絡 OFFICE NEXT｜開始辦公進化",
    description: "聯絡 OFFICE NEXT 辦公進化所，討論 ChatGPT 工作應用、GAS 辦公降載、Agent 高效槓桿、企業 AI 內訓與辦公自動化導入。",
    keywords: ["聯絡 OFFICE NEXT", "AI 辦公導入", "ChatGPT 工作應用", "GAS 辦公降載", "企業 AI 內訓", content.contact.email]
  });
}

export default async function ContactPage() {
  return <ContactPageContent content={await readContent()} />;
}
