import { DesignEditor } from "@/components/admin/design-editor";
import { readContent } from "@/lib/content-store";

export default async function AdminDesignPage() {
  const content = await readContent();
  return (
    <section className="grid gap-5">
      <div className="rounded-[2rem] border border-ink/8 bg-white/80 p-5">
        <h1 className="text-2xl font-medium text-ink">網站視覺設計</h1>
        <p className="mt-2 text-sm text-slate">調整 OFFICE NEXT 全站字級、留白、卡片與動畫。所有選項皆為已測試過的安全設計預設，不會直接寫入任意 CSS。</p>
      </div>
      <DesignEditor initialValue={content.design} />
    </section>
  );
}
