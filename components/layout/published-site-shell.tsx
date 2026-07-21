import type { ReactNode } from "react";

import { FooterContent } from "@/components/layout/footer";
import { FloatingCtaContent } from "@/components/layout/floating-cta";
import { HeaderContent } from "@/components/layout/header";
import type { SiteContent } from "@/types/content";

export function PublishedSiteShell({
  content,
  children
}: {
  content: SiteContent;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col" data-root-site-shell="published">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        跳到主要內容
      </a>
      <HeaderContent content={content} />
      <main
        id="main-content"
        className={`flex-1 ${content.design.floatingCta.enabled ? "pb-24 lg:pb-0" : "pb-0"}`}
      >
        {children}
      </main>
      <FloatingCtaContent content={content} />
      <FooterContent content={content} />
    </div>
  );
}
