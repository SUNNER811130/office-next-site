import Link from "next/link";

import { siteConfig } from "@/lib/site";

import { ButtonLink } from "../ui/button";
import { Container } from "../ui/container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/6 bg-paper/86 backdrop-blur-xl">
      <Container className="flex h-[78px] items-center justify-between gap-6">
        <Link href="/" className="min-w-0" aria-label="前往 OFFICE NEXT 首頁">
          <div className="text-[0.9rem] font-semibold uppercase tracking-[0.28em] text-ink">
            {siteConfig.shortName}
          </div>
          <div className="truncate pt-1 text-[11px] tracking-[0.22em] text-slate">
            White-Collar Strategy and AI Advisory
          </div>
        </Link>
        <nav aria-label="主要導覽" className="hidden items-center gap-8 text-sm text-slate lg:flex">
          {siteConfig.navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <ButtonLink href="/contact" variant="secondary" className="px-5 py-3 text-[11px] tracking-[0.22em]">
          預約品牌與 AI 策略諮詢
        </ButtonLink>
      </Container>
    </header>
  );
}
