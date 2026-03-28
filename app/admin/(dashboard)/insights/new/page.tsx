import { InsightEditor } from "@/components/admin/insight-editor";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewInsightPage() {
  const blankModel = {
    slug: "",
    title: "",
    summary: "",
    category: "白領工作升級",
    publishedAt: new Date().toISOString().split("T")[0],
    author: "OFFICE NEXT",
    readingTime: "5 min read",
    heroText: "",
    coverImageUrl: "",
    htmlContent: "",
    keyTakeaways: [],
    quickAnswers: [],
    bodySections: [],
    relatedLinks: [],
    cta: {
      title: "",
      description: "",
      primary: { label: "", href: "" },
      secondary: { label: "", href: "" }
    }
  };

  return (
    <div className="grid gap-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/insights" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/60 transition hover:bg-white text-ink">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-medium text-ink">新增文章</h1>
      </div>
      <InsightEditor 
        initialValue={blankModel}
        isNew={true}
      />
    </div>
  );
}
