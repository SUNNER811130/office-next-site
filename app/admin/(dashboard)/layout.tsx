import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/lib/admin-auth";

export default async function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requireAdminUser();

  return (
    <AdminShell title="OFFICE NEXT 輕後台" description="統一管理品牌文字、首頁模組、主理人、案例、FAQ、聯絡資訊與媒體資產。">
      {children}
    </AdminShell>
  );
}
