import { SectionEditor } from "@/components/admin/section-editor";
import { founderFields } from "@/lib/admin-field-config";
import { getContentWorkflowRepository } from "@/lib/content-store";

export default async function AdminFounderPage() {
  const snapshot = await getContentWorkflowRepository().readEditor("founder");
  return <SectionEditor section="founder" initialSnapshot={snapshot} fields={founderFields} />;
}
