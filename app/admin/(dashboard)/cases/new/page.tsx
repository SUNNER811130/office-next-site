import { CaseEditor } from "@/components/admin/case-editor";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewCasePage() {
  const blankModel = {
    slug: "",
    title: "",
    publishedAt: new Date().toISOString().split("T")[0],
    coverImageUrl: "",
    imageAltText: "",
    executiveSummary: "",
    challenge: "",
    solution: "",
    results: [],
    htmlContent: "",
  };

  return (
    <div className="grid gap-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/cases" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/60 transition hover:bg-white text-ink">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-medium text-ink">新增案例研究</h1>
      </div>
      <CaseEditor initialValue={blankModel} isNew={true} />
    </div>
  );
}
