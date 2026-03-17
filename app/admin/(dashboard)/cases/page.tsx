import { SectionEditor } from "@/components/admin/section-editor";
import { caseFields } from "@/lib/admin-field-config";
import { readContent } from "@/lib/content-store";

export default async function AdminCasesPage() {
  const content = await readContent();
  return <SectionEditor section="cases" initialValue={content.cases} fields={caseFields} />;
}
