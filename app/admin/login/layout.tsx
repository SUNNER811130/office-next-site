import { PublishedSiteShell } from "@/components/layout/published-site-shell";
import { readContent } from "@/lib/content-store";

export default async function AdminLoginLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await readContent();

  return <PublishedSiteShell content={content}>{children}</PublishedSiteShell>;
}
