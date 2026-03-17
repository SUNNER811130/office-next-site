import Link from "next/link";

import { siteConfig } from "@/lib/site";

import { ButtonLink } from "../ui/button";
import { Container } from "../ui/container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/8 bg-paper/85 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link href="/" className="min-w-0">
          <div className="text-sm font-semibold uppercase tracking-[0.26em] text-ink">
            {siteConfig.shortName}
          </div>
          <div className="truncate pt-1 text-xs tracking-[0.22em] text-slate">辦公進化所</div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-slate lg:flex">
          {siteConfig.navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <ButtonLink href="/contact" variant="secondary" className="px-4 py-2.5 text-xs">
          聯絡我們
        </ButtonLink>
      </Container>
    </header>
  );
}
