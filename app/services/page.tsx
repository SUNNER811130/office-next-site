import type { Metadata } from "next";

import { ServicesPageContent } from "@/components/services/services-page-content";

export const metadata: Metadata = {
  title: "服務項目",
  description:
    "OFFICE NEXT 辦公進化所提供為白領設計的 AI 工作升級服務，涵蓋白領 AI 課程、GPT 智慧工作模組、工作坊、企業內訓與流程優化顧問。"
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
