import { SectionEditor } from "@/components/admin/section-editor";
import { brandFields } from "@/lib/admin-field-config";
import { getContentWorkflowRepository } from "@/lib/content-store";

export default async function AdminBrandPage() {
  const snapshot = await getContentWorkflowRepository().readEditor("brand");
  return <SectionEditor section="brand" initialSnapshot={snapshot} fields={brandFields} />;
}
