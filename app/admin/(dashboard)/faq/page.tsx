import { SectionEditor } from "@/components/admin/section-editor";
import { faqFields } from "@/lib/admin-field-config";
import { readContent } from "@/lib/content-store";

export default async function AdminFaqPage() {
  const content = await readContent();
  return <SectionEditor section="faq" initialValue={content.faq} fields={faqFields} />;
}
