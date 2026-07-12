import Link from "next/link";

import { readContent } from "@/lib/content-store";

const sections = [
  { href: "/admin/design", label: "視覺設計", description: "全站字級、留白、卡片與動畫設計預設" },
  { href: "/admin/pages/home", label: "首頁區塊", description: "首頁區塊顯示、順序、背景、版型與動畫" },
  { href: "/admin/pages/services", label: "服務頁區塊", description: "服務頁區塊顯示、順序、背景、版型與動畫" },
  { href: "/admin/pages/about", label: "關於頁區塊", description: "關於頁區塊顯示、順序、背景、版型與動畫" },
  { href: "/admin/brand", label: "Brand", description: "品牌名稱、摘要、定位、Logo 與 OG" },
  { href: "/admin/home", label: "Home", description: "首頁 Hero、痛點、主張卡片與模組內容" },
  { href: "/admin/founder", label: "Founder", description: "主理人姓名、定位、簡介與照片" },
  { href: "/admin/services", label: "Services", description: "服務方向與配圖" },
  { href: "/admin/cases", label: "Cases", description: "案例摘要與區塊圖" },
  { href: "/admin/testimonials", label: "Testimonials", description: "見證內容與 logo / avatar" },
  { href: "/admin/faq", label: "FAQ", description: "常見問題與回答" },
  { href: "/admin/contact", label: "Contact", description: "聯絡信箱、選項與社群連結" },
  { href: "/admin/insights", label: "Insights", description: "知識觀點與文章 CRUD 管理" },
  { href: "/admin/media", label: "Media", description: "圖片、Logo、OG 與 client logo 管理" }
];

export default async function AdminDashboardPage() {
  const content = await readContent();

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 lg:grid-cols-3">
        <article className="rounded-[1.8rem] border border-ink/8 bg-white/86 p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Page Blocks</p>
          <p className="mt-3 text-xl font-medium text-ink">首頁區塊管理</p>
          <p className="mt-2 text-sm text-slate">目前啟用 {content.pageBlocks.home.filter((block) => block.enabled).length} 個區塊</p>
          <Link href="/admin/pages/home" className="mt-4 inline-flex rounded-full border border-ink/10 px-4 py-2 text-sm text-ink">前往首頁區塊</Link>
        </article>
        <article className="rounded-[1.8rem] border border-ink/8 bg-white/86 p-5"><p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Page Blocks</p><p className="mt-3 text-xl font-medium text-ink">關於頁區塊管理</p><p className="mt-2 text-sm text-slate">目前啟用 {content.pageBlocks.about.filter((block) => block.enabled).length} 個區塊</p><Link href="/admin/pages/about" className="mt-4 inline-flex rounded-full border border-ink/10 px-4 py-2 text-sm text-ink">前往關於頁區塊</Link></article>
        <article className="rounded-[1.8rem] border border-ink/8 bg-white/86 p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Page Blocks</p><p className="mt-3 text-xl font-medium text-ink">服務頁區塊管理</p><p className="mt-2 text-sm text-slate">目前啟用 {content.pageBlocks.services.filter((block) => block.enabled).length} 個區塊</p><Link href="/admin/pages/services" className="mt-4 inline-flex rounded-full border border-ink/10 px-4 py-2 text-sm text-ink">前往服務頁區塊</Link>
        </article>
        <article className="rounded-[1.8rem] border border-ink/8 bg-white/86 p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Design</p>
          <p className="mt-3 text-xl font-medium text-ink">{content.design.cards.style}</p>
          <p className="mt-2 text-sm text-slate">密度 {content.design.layout.density} · 動畫 {content.design.motion.preset}</p>
          <Link href="/admin/design" className="mt-4 inline-flex rounded-full border border-ink/10 px-4 py-2 text-sm text-ink">前往視覺設計</Link>
        </article>
        <article className="rounded-[1.8rem] border border-ink/8 bg-white/86 p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Brand</p>
          <p className="mt-3 text-xl font-medium text-ink">{content.brand.name}</p>
          <p className="mt-2 text-sm text-slate">{content.brand.positioning}</p>
        </article>
        <article className="rounded-[1.8rem] border border-ink/8 bg-white/86 p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Founder</p>
          <p className="mt-3 text-xl font-medium text-ink">{content.founder.name}</p>
          <p className="mt-2 text-sm text-slate">{content.founder.tagline}</p>
        </article>
        <article className="rounded-[1.8rem] border border-ink/8 bg-white/86 p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Contact</p>
          <p className="mt-3 text-xl font-medium text-ink">{content.contact.email}</p>
          <p className="mt-2 text-sm text-slate">{content.contact.responseExpectation}</p>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-[1.8rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,239,232,0.92))] p-5 transition hover:-translate-y-0.5 hover:border-ink/14"
          >
            <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">{section.label}</p>
            <p className="mt-3 text-lg font-medium text-ink">{section.label}</p>
            <p className="mt-2 text-sm text-slate">{section.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
