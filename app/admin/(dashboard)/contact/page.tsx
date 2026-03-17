import { SectionEditor } from "@/components/admin/section-editor";
import { contactFields, socialFields } from "@/lib/admin-field-config";
import { readContent } from "@/lib/content-store";

export default async function AdminContactPage() {
  const content = await readContent();

  return (
    <div className="grid gap-5">
      <SectionEditor section="contact" initialValue={content.contact} fields={contactFields} />
      <SectionEditor section="social" initialValue={content.social} fields={socialFields} />
    </div>
  );
}
