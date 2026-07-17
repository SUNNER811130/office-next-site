import type { ReactNode } from "react";

import { FooterContent } from "@/components/layout/footer";
import { FloatingCtaContent } from "@/components/layout/floating-cta";
import { HeaderContent } from "@/components/layout/header";
import { getDesignCssVariables, getDesignDataAttributes } from "@/lib/design-settings";
import type { SiteContent } from "@/types/content";

export function AdminPreviewSiteShell({
  source,
  content,
  children
}: {
  source: "draft" | "published";
  content: SiteContent;
  children: ReactNode;
}) {
  const designAttributes = getDesignDataAttributes(content.design);
  const designStyle = getDesignCssVariables(content.design);

  return (
    <div
      {...designAttributes}
      data-admin-preview-root
      data-preview-source={source}
      style={designStyle}
      className="flex min-h-screen flex-col bg-paper text-slate"
    >
      <div
        role="status"
        className={`sticky top-0 z-[70] border-b px-4 py-3 text-center text-sm font-medium ${
          source === "draft"
            ? "border-amber-700/20 bg-amber-50 text-amber-900"
            : "border-ink/10 bg-white text-ink"
        }`}
      >
        {source === "draft" ? "草稿預覽｜此內容尚未發布" : "已發布版本｜目前沒有草稿"}
      </div>
      <HeaderContent content={content} />
      <main
        aria-label="管理員內容預覽"
        className={`flex-1 ${content.design.floatingCta.enabled ? "pb-24 lg:pb-0" : "pb-0"}`}
      >
        {children}
      </main>
      <FloatingCtaContent content={content} />
      <FooterContent content={content} />
    </div>
  );
}
