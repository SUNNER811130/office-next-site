import Link from "next/link";

import type { InsightPost } from "@/lib/insights";

export function ArticleCard({ post }: { post: InsightPost }) {
  return (
    <article className="group rounded-2xl bg-white/70 p-7 shadow-glass backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-hover md:p-8">
      <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-champagne">
        <span>{post.category}</span>
        <span className="h-1 w-1 rounded-full bg-champagne/60" />
        <time dateTime={post.publishedAt}>{post.publishedAt}</time>
      </div>
      <h2 className="mt-6 max-w-[18ch] text-balance text-[1.8rem] font-medium leading-[1.12] text-midnight md:text-[2.2rem]">
        <Link href={`/insights/${post.slug}`} className="transition hover:text-slate">
          {post.title}
        </Link>
      </h2>
      <p className="mt-5 max-w-[44rem] text-base text-slate">{post.summary}</p>
      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-midnight/8 pt-5 text-sm text-slate">
        <span>{post.author}</span>
        <span>{post.readingTime}</span>
        <Link
          href={`/insights/${post.slug}`}
          className="text-midnight transition group-hover:text-champagne"
        >
          閱讀這篇觀點文章
        </Link>
      </div>
    </article>
  );
}
