import { SectionEditor } from "@/components/admin/section-editor";
import { faqFields } from "@/lib/admin-field-config";
import { getContentWorkflowRepository } from "@/lib/content-store";

export default async function AdminFaqPage() {
  const snapshot = await getContentWorkflowRepository().readEditor("faq");
  return <SectionEditor section="faq" initialSnapshot={snapshot} fields={faqFields} />;
}
