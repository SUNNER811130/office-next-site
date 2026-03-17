import { SectionEditor } from "@/components/admin/section-editor";
import { founderFields } from "@/lib/admin-field-config";
import { readContent } from "@/lib/content-store";

export default async function AdminFounderPage() {
  const content = await readContent();
  return <SectionEditor section="founder" initialValue={content.founder} fields={founderFields} />;
}
