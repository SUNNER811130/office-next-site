import Link from "next/link";
import { getAllInsights } from "@/lib/insights";
import { AdminInsightList } from "@/components/admin/insight-list";

export default async function AdminInsightsPage() {
  const posts = await getAllInsights();

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between rounded-[1.8rem] border border-ink/8 bg-white/86 p-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Content Hub</p>
          <h1 className="mt-3 text-2xl font-medium text-ink">知識觀點管理</h1>
          <p className="mt-2 text-sm text-slate">前台 /insights 頁面的文章皆於此新增編輯與刪除。</p>
        </div>
        <Link 
          href="/admin/insights/new"
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition hover:bg-ink/90"
        >
          新增文章
        </Link>
      </div>

      <AdminInsightList posts={posts} />
    </div>
  );
}
