"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function RootSiteShell({
  children,
  header,
  floatingCta,
  footer,
  floatingCtaEnabled
}: {
  children: ReactNode;
  header: ReactNode;
  floatingCta: ReactNode;
  footer: ReactNode;
  floatingCtaEnabled: boolean;
}) {
  const pathname = usePathname();
  const isAdminPreview = pathname.startsWith("/admin/preview/");

  return (
    <div className="relative flex min-h-screen flex-col" data-root-site-shell={isAdminPreview ? "preview" : "published"}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        跳到主要內容
      </a>
      {isAdminPreview ? null : header}
      <main
        id="main-content"
        className={`flex-1 ${!isAdminPreview && floatingCtaEnabled ? "pb-24 lg:pb-0" : "pb-0"}`}
      >
        {children}
      </main>
      {isAdminPreview ? null : floatingCta}
      {isAdminPreview ? null : footer}
    </div>
  );
}
