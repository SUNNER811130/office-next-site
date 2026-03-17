import { Section } from "../ui/section";
import { SectionTitle } from "../ui/section-title";

export function BrandCoreSection() {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <SectionTitle
          eyebrow="Core Proposition"
          title="重新設計你的辦公方式"
          description="很多人以為工作升級，是更努力一點、更快一點、再撐一下。但真正拉開差距的，往往不是投入更多時間，而是懂得把哪些事交給自己，哪些事交給 AI。"
        />
        <div className="space-y-8 text-base leading-8 text-slate md:text-lg">
          <p>
            OFFICE NEXT 不只是教你怎麼使用工具，而是幫助你把 AI 真正接進工作流程，從日常協作、資訊整理、會議彙整，到提案、追進度與重複事務優化，讓工作更有秩序，也更有餘裕。
          </p>
          <div className="rounded-[2rem] border border-ink/10 bg-[#f6f2eb] px-7 py-8 text-sm uppercase tracking-[0.32em] text-ink">
            更少重複 / 更高價值 / 更聰明的辦公方式
          </div>
        </div>
      </div>
    </Section>
  );
}
