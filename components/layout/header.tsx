import Image from "next/image";
import Link from "next/link";

import { readContent } from "@/lib/content-store";

import { ButtonLink } from "../ui/button";
import { Container } from "../ui/container";

export async function Header() {
  const content = await readContent();
  const headerLogo = content.brand.logoWordmarkHeaderUrl || content.brand.logoWordmarkUrl;

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl shadow-glass">
      <Container className="flex h-[96px] items-center justify-between gap-8">
        <Link href="/" className="min-w-0 shrink-0" aria-label={`返回 ${content.brand.name} 首頁`}>
          {headerLogo ? (
            <Image
              src={headerLogo}
              alt={content.brand.name}
              width={600}
              height={52}
              className="h-9 w-auto max-w-[320px] object-contain md:h-11 md:max-w-[400px]"
              priority
              unoptimized
            />
          ) : (
            <div className="text-[1.1rem] font-bold uppercase tracking-[0.32em] text-midnight">
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
        <ButtonLink href="/contact" variant="secondary" className="shrink-0 px-6 py-3 text-[11px] tracking-[0.22em]">
          {content.contact.mailtoLabel}
        </ButtonLink>
      </Container>
    </header>
  );
}
