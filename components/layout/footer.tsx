import Link from "next/link";

import { brandEntity, siteConfig } from "@/lib/site";

import { Container } from "../ui/container";

const footerLinks = [
  { href: "/services", label: "查看服務項目與合作方向" },
  { href: "/corporate-training", label: "了解企業內訓與合作模式" },
  { href: "/about", label: "認識 OFFICE NEXT 的品牌定位" },
  { href: "/contact", label: "前往聯絡頁提出需求" }
];

export function Footer() {
  return (
    <footer className="border-t border-ink/8 bg-[#efe7dc] py-14 md:py-16">
      <Container className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.7fr]">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-ink">
            {siteConfig.shortName}
          </p>
          <p className="max-w-2xl text-base text-slate">{brandEntity.shortDescription}</p>
          <p className="text-sm tracking-[0.14em] text-slate">
            {brandEntity.positioning}
            <br />
            {brandEntity.proposition}
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-bronze">Explore</p>
          <nav aria-label="頁尾導覽" className="grid gap-3 text-sm text-slate">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-bronze">Brand Entity</p>
          <div className="space-y-3 text-sm text-slate">
            <p>{brandEntity.url}</p>
            <Link href={`mailto:${siteConfig.contactEmail}`} className="transition hover:text-ink">
              {siteConfig.contactEmail}
            </Link>
            <p>Social links reserved for future sameAs profiles</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
