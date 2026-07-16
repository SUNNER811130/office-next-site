import { HomeBlockEditor } from "@/components/admin/home-block-editor";
import { getContentWorkflowRepository } from "@/lib/content-store";

export default async function AdminHomeBlocksPage() {
  const snapshot = await getContentWorkflowRepository().readEditor("pageBlocks.home");
  return (
    <section className="grid gap-5">
      <div className="rounded-[2rem] border border-ink/8 bg-white/80 p-5">
        <h1 className="text-2xl font-medium text-ink">首頁區塊管理</h1>
        <p className="mt-2 text-sm text-slate">控制首頁各區塊的顯示、順序、背景、版型與動畫。所有選項皆為已測試的安全預設，不會直接寫入任意 CSS。</p>
      </div>
      <HomeBlockEditor initialSnapshot={snapshot} />
    </section>
  );
}
