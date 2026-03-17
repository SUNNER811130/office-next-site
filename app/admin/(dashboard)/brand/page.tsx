import { SectionEditor } from "@/components/admin/section-editor";
import { brandFields } from "@/lib/admin-field-config";
import { readContent } from "@/lib/content-store";

export default async function AdminBrandPage() {
  const content = await readContent();
  return <SectionEditor section="brand" initialValue={content.brand} fields={brandFields} />;
}
