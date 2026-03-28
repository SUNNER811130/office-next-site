"use client";

import { useState } from "react";
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
  const [data, setData] = useState<CaseStudy>(initialValue);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    const prompt = window.prompt("請輸入一句話的案例核心重點（例如：幫某製造業導入 AI，三個月內效率提升 40%）：");
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const generated = await res.json();
      
      if (!res.ok) throw new Error(generated.error || "生成失敗");

      setData(prev => ({
        ...prev,
        executiveSummary: generated.executiveSummary || prev.executiveSummary,
        challenge: generated.challenge || prev.challenge,
        solution: generated.solution || prev.solution,
        results: generated.results || prev.results,
        htmlContent: generated.executiveSummary ? `<p><strong>${generated.executiveSummary}</strong></p><p><strong>面臨挑戰：</strong><br/>${generated.challenge}</p><p><strong>解決方案：</strong><br/>${generated.solution}</p>` : prev.htmlContent
      }));
      
    } catch (e: any) {
      alert("AI 生成錯誤：" + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

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

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between rounded-[1.4rem] border border-bronze/20 bg-[#fbf5f0] p-5 shadow-sm">
        <div>
          <h3 className="text-lg font-medium text-ink">✨ AI 文案助手</h3>
          <p className="mt-1 text-sm text-slate">輸入一句粗略草稿，由 DeepSeek 自動為您擴寫符合 GEO 格式的結構化內容。</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          type="button"
          className="rounded-full bg-bronze px-5 py-2.5 text-sm font-medium text-white transition hover:bg-bronze/90 disabled:opacity-50"
        >
          {isGenerating ? "生成中..." : "DeepSeek 幫我擴寫"}
        </button>
      </div>
      <SectionEditor section="case" initialValue={data} onChange={setData} fields={caseEditorFields} onSaveAsync={handleSave} />
    </div>
  );
}
