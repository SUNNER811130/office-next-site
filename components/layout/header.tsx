import Image from "next/image";
import Link from "next/link";

import { readContent } from "@/lib/content-store";

import { ButtonLink } from "../ui/button";
import { Container } from "../ui/container";

export async function Header() {
  const content = await readContent();

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl shadow-glass">
      <Container className="flex h-[78px] items-center justify-between gap-6">
        <Link href="/" className="min-w-0" aria-label={`返回 ${content.brand.name} 首頁`}>
          {content.brand.logoWordmarkUrl ? (
            <Image
              src={content.brand.logoWordmarkUrl}
              alt={content.brand.name}
              width={400}
              height={100}
              className="h-14 w-auto max-w-[320px] object-contain"
            />
          ) : (
            <div className="text-[0.9rem] font-semibold uppercase tracking-[0.28em] text-midnight">
              {content.brand.shortName}
            </div>
          )}

        </Link>
        <nav aria-label="主選單" className="hidden items-center gap-8 text-sm text-slate lg:flex">
          {content.navigation.navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-midnight">
              {item.label}
            </Link>
          ))}
        </nav>
        <ButtonLink href="/contact" variant="secondary" className="px-5 py-3 text-[11px] tracking-[0.22em]">
          {content.contact.mailtoLabel}
        </ButtonLink>
      </Container>
    </header>
  );
}
