import { ContactBlockEditor } from "@/components/admin/contact-block-editor";
import { getContentWorkflowRepository } from "@/lib/content-store";

export default async function AdminContactBlocksPage() {
  const snapshot = await getContentWorkflowRepository().readEditor("pageBlocks.contact");
  return <section className="grid gap-5"><div className="rounded-[2rem] border border-ink/8 bg-white/80 p-5"><h1 className="text-2xl font-medium text-ink">聯絡頁區塊管理</h1><p className="mt-2 text-sm text-slate">控制聯絡頁各區塊的顯示、順序、背景、版型與動畫。所有選項皆為已測試的安全設計預設，不會直接寫入任意 CSS。</p></div><ContactBlockEditor initialSnapshot={snapshot} /></section>;
}
