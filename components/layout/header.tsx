import Image from "next/image";
import Link from "next/link";

import { readContent } from "@/lib/content-store";

import { ButtonLink } from "../ui/button";
import { Container } from "../ui/container";

export async function Header() {
  const content = await readContent();
  const headerLogo = content.brand.logoWordmarkHeaderUrl || content.brand.logoWordmarkUrl;

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/72 backdrop-blur-xl shadow-glass">
      <Container className="site-header flex items-center justify-between gap-3 md:gap-8">
        <Link href="/" className="min-w-0 shrink-0" aria-label={`返回 ${content.brand.name} 首頁`}>
          {headerLogo ? (
            <Image
              src={headerLogo}
              alt="OFFICE NEXT 辦公進化所 Logo"
              width={520}
              height={48}
              className="h-8 w-auto max-w-[210px] object-contain sm:max-w-[300px] md:h-9 md:max-w-[360px]"
              priority
            />
          ) : (
            <div className="text-[1.1rem] font-bold uppercase tracking-[0.32em] text-midnight">
              {content.brand.shortName}
            </div>
          )}

        </Link>
        <nav aria-label="主選單" className="hidden items-center gap-8 text-sm text-slate lg:flex">
          {content.navigation.navItems.map((item) => (
            <Link key={item.href} href={item.href} className="relative transition hover:text-midnight after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-champagne after:transition-all after:duration-300 hover:after:w-full motion-reduce:after:transition-none">
              {item.label}
            </Link>
          ))}
        </nav>
        <ButtonLink href="/contact" variant="secondary" className="shrink-0 px-3 py-2.5 text-[10px] tracking-[0.12em] sm:px-5 sm:text-[11px] sm:tracking-[0.18em]">
          開始辦公進化
        </ButtonLink>
      </Container>
    </header>
  );
}
