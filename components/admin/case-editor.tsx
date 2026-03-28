"use client";

import { useRouter } from "next/navigation";
import { SectionEditor, type SectionField } from "./section-editor";
import type { CaseStudy } from "@/lib/cases";

const caseEditorFields: SectionField[] = [
  { type: "text", path: "slug", label: "網址代稱 (Slug)", placeholder: "e.g. tech-corp-agile-transformation", description: "只能用英文數字加連字號" },
  { type: "text", path: "title", label: "標題" },
  { type: "text", path: "publishedAt", label: "發布日期", placeholder: "e.g. 2026-03-28" },
  { type: "media", path: "coverImageUrl", label: "封面圖片 (16:9)", category: "sections", description: "建議尺寸：1200x630px" },
  { type: "text", path: "imageAltText", label: "Image Alt Text (圖片描述)", description: "用於 SEO 與無障礙，務必描述圖片內容與案例關鍵字" },
  { type: "textarea", path: "executiveSummary", label: "Executive Summary (執行摘要)", description: "一段話總結這次專案的核心成效，方便 AI 快速理解重點" },
  { type: "textarea", path: "challenge", label: "Challenge (面臨挑戰)", description: "客戶遇到的問題與痛點" },
  { type: "textarea", path: "solution", label: "Solution (解決方案)", description: "Office Next 採取的行動與導入框架" },
  { type: "string-list", path: "results", itemLabel: "成效數據", label: "Results (成效數據)", description: "列出具體提升的百分比或時數，幫助搜尋引擎抓取 Snippet" },
  { type: "richtext", path: "htmlContent", label: "文章內容", description: "進一步的詳細說明" },
];

export function CaseEditor({ initialValue, isNew }: { initialValue: CaseStudy, isNew: boolean }) {
  const router = useRouter();

  const handleSave = async (value: any) => {
    if (isNew) {
      const res = await fetch("/api/admin/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } else {
      const res = await fetch(`/api/admin/cases/${initialValue.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    }
    router.push("/admin/cases");
    router.refresh();
  };

  return <SectionEditor section="case" initialValue={initialValue} fields={caseEditorFields} onSaveAsync={handleSave} />;
}
