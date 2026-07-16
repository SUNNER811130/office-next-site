import { SectionEditor } from "@/components/admin/section-editor";
import { testimonialFields } from "@/lib/admin-field-config";
import { getContentWorkflowRepository } from "@/lib/content-store";

export default async function AdminTestimonialsPage() {
  const snapshot = await getContentWorkflowRepository().readEditor("testimonials");
  return <SectionEditor section="testimonials" initialSnapshot={snapshot} fields={testimonialFields} />;
}
