import { SectionEditor } from "@/components/admin/section-editor";
import { servicesFields } from "@/lib/admin-field-config";
import { getContentWorkflowRepository } from "@/lib/content-store";

export default async function AdminServicesPage() {
  const snapshot = await getContentWorkflowRepository().readEditor("services");
  return <SectionEditor section="services" initialSnapshot={snapshot} fields={servicesFields} />;
}
