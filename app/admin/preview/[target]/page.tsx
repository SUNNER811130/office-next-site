import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";

import { AboutPageContent } from "@/components/public-pages/about-page-content";
import { ContactPageContent } from "@/components/public-pages/contact-page-content";
import { HomePageContent } from "@/components/public-pages/home-page-content";
import { ServicesPageContent } from "@/components/public-pages/services-page-content";
import { AdminPreviewSiteShell } from "@/components/admin/preview/admin-preview-site-shell";
import { isAdminPreviewTarget, readAdminPreview } from "@/lib/admin-preview";
import { requireAdminUser } from "@/lib/admin-auth";
import type { AdminPreviewTarget } from "@/lib/admin-preview-types";
import type { SiteContent } from "@/types/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "管理員草稿預覽",
  robots: { index: false, follow: false }
};

function PreviewPageContent({ target, content }: { target: AdminPreviewTarget; content: SiteContent }) {
  if (target === "home") return <HomePageContent content={content} />;
  if (target === "services") return <ServicesPageContent content={content} />;
  if (target === "about") return <AboutPageContent content={content} />;
  return <ContactPageContent content={content} />;
}

export default async function AdminPreviewPage({
  params
}: {
  params: Promise<{ target: string }>;
}) {
  noStore();
  await requireAdminUser();

  const { target } = await params;
  if (!isAdminPreviewTarget(target)) notFound();

  const preview = await readAdminPreview(target);
  return (
    <AdminPreviewSiteShell source={preview.source} content={preview.content}>
      <PreviewPageContent target={target} content={preview.content} />
    </AdminPreviewSiteShell>
  );
}
