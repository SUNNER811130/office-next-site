import { Section } from "../ui/section";

export function WhySection() {
  return (
    <Section surface="muted">
      <div className="mx-auto max-w-[1120px] rounded-[2.75rem] border border-white/70 bg-white/78 p-8 shadow-[0_24px_80px_rgba(17,17,17,0.06)] md:p-12 lg:p-14">
        <p className="text-[11px] uppercase tracking-[0.34em] text-bronze">Why We Started</p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="space-y-6 text-[1rem] text-slate md:text-[1.05rem]">
            <p>
              多數人已經知道 AI 有幫助，但真正卡住的，往往不是「要不要用」，而是「怎麼把它放進每天的工作裡」。尤其在白領場景中，工作經常跨越簡報、報表、回覆、資料整理與跨部門協作，工具再多，若沒有方法，仍然難以形成穩定產出。
            </p>
            <p>
              OFFICE NEXT 因此從商務脈絡出發，重新整理 AI 在工作現場的角色。我們關心的是效率如何被系統化，而不是單點技巧如何被短暫炫耀。
            </p>
            <p>
              這也是品牌成立的原因：讓 AI 不只是更快，而是讓工作方式本身變得更成熟、更有秩序。
            </p>
          </div>
          <blockquote className="flex items-end rounded-[2.2rem] bg-ink px-8 py-10 text-[1.9rem] leading-[1.45] text-paper md:text-[2.45rem]">
            把時間留給判斷、溝通與價值創造，把重複工作交給 AI。
          </blockquote>
        </div>
      </div>
    </Section>
  );
}
