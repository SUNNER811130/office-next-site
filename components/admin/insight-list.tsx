"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { InsightPost } from "@/lib/insights";

export function AdminInsightList({ posts }: { posts: InsightPost[] }) {
  const router = useRouter();

  const handleDelete = async (slug: string) => {
    if (!confirm("確定要刪除這篇文章嗎？此動作無法還原。")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/insights/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("刪除失敗");
      router.refresh();
    } catch (e: any) {
      alert(e.message || "發生錯誤");
    }
  };

  if (posts.length === 0) {
    return <p className="py-10 text-center text-sm text-slate">目前尚無文章，點擊上方按鈕新增第一篇吧！</p>;
  }

  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <div key={post.slug} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[1.4rem] border border-ink/8 bg-[#fcfaf7] p-5 shadow-sm">
          <div>
            <p className="font-medium text-ink">{post.title}</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate">
              <span className="rounded-full bg-ink/5 px-2 py-0.5">{post.category}</span>
              <span>{post.publishedAt}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/admin/insights/${post.slug}`}
              className="text-sm font-medium text-ink transition hover:text-bronze"
            >
              編輯文章
            </Link>
            <button
              onClick={() => handleDelete(post.slug)}
              className="text-sm font-medium text-red-600 transition hover:text-red-700"
            >
              刪除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
