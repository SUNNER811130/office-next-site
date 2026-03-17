import Link from "next/link";

import type { InsightPost } from "@/lib/insights";

export function ArticleCard({ post }: { post: InsightPost }) {
  return (
    <article className="group rounded-[2.5rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,233,0.98))] p-7 shadow-[0_24px_60px_rgba(17,17,17,0.06)] transition duration-300 hover:-translate-y-1 hover:border-ink/14 hover:shadow-[0_32px_82px_rgba(17,17,17,0.1)] md:p-8">
      <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-bronze">
        <span>{post.category}</span>
        <span className="h-1 w-1 rounded-full bg-bronze/60" />
        <time dateTime={post.publishedAt}>{post.publishedAt}</time>
      </div>
      <h2 className="mt-6 max-w-[18ch] text-balance text-[1.8rem] font-medium leading-[1.12] text-ink md:text-[2.2rem]">
        <Link href={`/insights/${post.slug}`} className="transition hover:text-slate">
          {post.title}
        </Link>
      </h2>
      <p className="mt-5 max-w-[44rem] text-base text-slate">{post.summary}</p>
      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-ink/8 pt-5 text-sm text-slate">
        <span>{post.author}</span>
        <span>{post.readingTime}</span>
        <Link
          href={`/insights/${post.slug}`}
          className="text-ink transition group-hover:text-slate"
        >
          閱讀這篇觀點文章
        </Link>
      </div>
    </article>
  );
}
