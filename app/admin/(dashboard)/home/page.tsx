import { SectionEditor } from "@/components/admin/section-editor";
import { homeFields } from "@/lib/admin-field-config";
import { getContentWorkflowRepository } from "@/lib/content-store";

export default async function AdminHomePage() {
  const snapshot = await getContentWorkflowRepository().readEditor("home");
  return <SectionEditor section="home" initialSnapshot={snapshot} fields={homeFields} />;
}
