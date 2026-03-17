import Link from "next/link";

import { siteConfig } from "@/lib/site";

import { Container } from "../ui/container";

const footerLinks = [
  { href: "/services", label: "顧問與課程" },
  { href: "/corporate-training", label: "企業內訓" },
  { href: "/about", label: "品牌理念" },
  { href: "/contact", label: "聯絡我們" }
];

export function Footer() {
  return (
    <footer className="border-t border-ink/8 bg-[#efe7dc] py-14 md:py-16">
      <Container className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.7fr]">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-ink">
            {siteConfig.shortName}
          </p>
          <p className="max-w-2xl text-base text-slate">{siteConfig.description}</p>
          <p className="text-sm tracking-[0.14em] text-slate">
            OFFICE NEXT 辦公進化所
            <br />
            讓 AI 成為你的工作協作員
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-bronze">Explore</p>
          <div className="grid gap-3 text-sm text-slate">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-ink">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-bronze">Contact</p>
          <div className="space-y-3 text-sm text-slate">
            <p>企業課程與顧問合作洽詢</p>
            <p>hello@officenext.tw</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
