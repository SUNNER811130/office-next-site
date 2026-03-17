import { ServicesPageContent } from "@/components/services/services-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/services",
  title: "服務項目",
  description:
    "查看 OFFICE NEXT 的 AI 策略顧問、品牌與服務設計、工作流程重整等核心服務，了解適合對象與合作方向。",
  keywords: ["服務項目", "AI 顧問服務", "品牌顧問", "工作流程設計"]
});

export default function ServicesPage() {
  return <ServicesPageContent />;
}
