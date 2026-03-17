import Link from "next/link";

import { siteConfig } from "@/lib/site";

import { Container } from "../ui/container";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-[#f2ede5] py-12">
      <Container className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ink">
            {siteConfig.shortName}
          </p>
          <p className="max-w-2xl text-base leading-8 text-slate">{siteConfig.description}</p>
          <p className="text-sm tracking-[0.18em] text-bronze">未來辦公，從現在進化。</p>
        </div>
        <div className="grid gap-3 text-sm text-slate sm:grid-cols-2 lg:justify-self-end">
          {siteConfig.navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
