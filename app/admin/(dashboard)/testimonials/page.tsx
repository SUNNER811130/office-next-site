import { SectionEditor } from "@/components/admin/section-editor";
import { testimonialFields } from "@/lib/admin-field-config";
import { readContent } from "@/lib/content-store";

export default async function AdminTestimonialsPage() {
  const content = await readContent();
  return <SectionEditor section="testimonials" initialValue={content.testimonials} fields={testimonialFields} />;
}
