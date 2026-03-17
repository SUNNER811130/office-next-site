import { SectionEditor } from "@/components/admin/section-editor";
import { homeFields } from "@/lib/admin-field-config";
import { readContent } from "@/lib/content-store";

export default async function AdminHomePage() {
  const content = await readContent();
  return <SectionEditor section="home" initialValue={content.home} fields={homeFields} />;
}
