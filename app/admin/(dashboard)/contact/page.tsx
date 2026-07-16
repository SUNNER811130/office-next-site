import { SectionEditor } from "@/components/admin/section-editor";
import { contactFields, socialFields } from "@/lib/admin-field-config";
import { getContentWorkflowRepository } from "@/lib/content-store";

export default async function AdminContactPage() {
  const repository = getContentWorkflowRepository();
  const [contactSnapshot, socialSnapshot] = await Promise.all([
    repository.readEditor("contact"),
    repository.readEditor("social")
  ]);

  return (
    <div className="grid gap-5">
      <SectionEditor section="contact" initialSnapshot={contactSnapshot} fields={contactFields} />
      <SectionEditor section="social" initialSnapshot={socialSnapshot} fields={socialFields} />
    </div>
  );
}
