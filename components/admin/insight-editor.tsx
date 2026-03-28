"use client";

import { useRouter } from "next/navigation";
import { SectionEditor, type SectionField } from "./section-editor";
import type { InsightPost } from "@/lib/insights";

const insightFields: SectionField[] = [
  { type: "text", path: "slug", label: "網址代稱 (Slug)", placeholder: "e.g. why-ai-matters", description: "只能用英文數字加連字號，建立後不建議修改" },
  { type: "text", path: "title", label: "標題" },
  { type: "text", path: "category", label: "分類" },
  { type: "textarea", path: "summary", label: "摘要" },
  { type: "text", path: "publishedAt", label: "發布日期", placeholder: "e.g. 2026-03-24" },
  { type: "text", path: "author", label: "作者" },
  { type: "text", path: "readingTime", label: "閱讀時間" },
  { type: "textarea", path: "heroText", label: "Hero 導語文字" },
  { type: "media", path: "coverImageUrl", label: "封面圖片 (16:9)", category: "sections", description: "建議尺寸：1200x630px 16:9 比例" },
  { type: "richtext", path: "htmlContent", label: "文章內容" },
  { type: "string-list", path: "keyTakeaways", itemLabel: "Takeaway", label: "Key Takeaways" },
  { 
    type: "object-list", 
    path: "quickAnswers", 
    label: "Quick Answers", 
    itemLabel: "Q&A", 
    fields: [
      { name: "question", label: "問題" }, 
      { name: "answer", label: "回答", type: "textarea" }
    ] 
  },
  { 
    type: "object-list", 
    path: "relatedLinks", 
    label: "相關文章/連結", 
    itemLabel: "連結", 
    fields: [
      { name: "label", label: "標籤" }, 
      { name: "href", label: "網址/路徑" }
    ] 
  },
  { type: "text", path: "cta.title", label: "CTA 主標題" },
  { type: "textarea", path: "cta.description", label: "CTA 副標題描述" },
  { type: "text", path: "cta.primary.label", label: "主要按鈕名稱" },
  { type: "text", path: "cta.primary.href", label: "主要按鈕網址" },
  { type: "text", path: "cta.secondary.label", label: "次要按鈕名稱" },
  { type: "text", path: "cta.secondary.href", label: "次要按鈕網址" },
];

export function InsightEditor({ initialValue, isNew }: { initialValue: Omit<InsightPost, "updatedAt">, isNew: boolean }) {
  const router = useRouter();

  const handleSave = async (value: any) => {
    if (isNew) {
      const res = await fetch("/api/admin/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } else {
      const res = await fetch(`/api/admin/insights/${initialValue.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    }
    router.push("/admin/insights");
    router.refresh();
  };

  return <SectionEditor section="insight" initialValue={initialValue} fields={insightFields} onSaveAsync={handleSave} />;
}
