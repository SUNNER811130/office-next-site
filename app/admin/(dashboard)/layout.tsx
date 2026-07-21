import { AdminShell } from "@/components/admin/admin-shell";
import { PublishedSiteShell } from "@/components/layout/published-site-shell";
import { requireAdminUser } from "@/lib/admin-auth";
import { readContent } from "@/lib/content-store";

export default async function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requireAdminUser();
  const content = await readContent();

  return (
    <PublishedSiteShell content={content}>
      <AdminShell title="OFFICE NEXT 輕後台" description="統一管理品牌文字、首頁模組、主理人、案例、FAQ、聯絡資訊與媒體資產。">
        {children}
      </AdminShell>
    </PublishedSiteShell>
  );
}
