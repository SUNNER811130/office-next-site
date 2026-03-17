import { SectionEditor } from "@/components/admin/section-editor";
import { servicesFields } from "@/lib/admin-field-config";
import { readContent } from "@/lib/content-store";

export default async function AdminServicesPage() {
  const content = await readContent();
  return <SectionEditor section="services" initialValue={content.services} fields={servicesFields} />;
}
