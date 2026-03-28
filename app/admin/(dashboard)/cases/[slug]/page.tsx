import { CaseEditor } from "@/components/admin/case-editor";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCaseBySlug } from "@/lib/cases";
import { notFound } from "next/navigation";

export default async function EditCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getCaseBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="grid gap-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/cases" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/60 transition hover:bg-white text-ink">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-medium text-ink">編輯案例研究</h1>
      </div>
      <CaseEditor initialValue={post} isNew={false} />
    </div>
  );
}
