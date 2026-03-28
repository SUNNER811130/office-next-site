import Link from "next/link";
import { getAllCases } from "@/lib/cases";
import { AdminCaseList } from "@/components/admin/case-list";

export default async function AdminCasesPage() {
  const posts = (await getAllCases()) || [];

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between rounded-[1.8rem] border border-ink/8 bg-white/86 p-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">GEO Optimized</p>
          <h1 className="mt-3 text-2xl font-medium text-ink">案例研究管理 (Case Studies)</h1>
          <p className="mt-2 text-sm text-slate">建立與編輯具備深刻 SEO 結構的客戶成功案例。</p>
        </div>
        <Link 
          href="/admin/cases/new"
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition hover:bg-ink/90"
        >
          新增案例
        </Link>
      </div>

      <AdminCaseList posts={posts} />
    </div>
  );
}
