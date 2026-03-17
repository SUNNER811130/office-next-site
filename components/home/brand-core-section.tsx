import { Section } from "../ui/section";
import { SectionTitle } from "../ui/section-title";

export function BrandCoreSection() {
  return (
    <Section className="pb-16 pt-16 md:pb-20 md:pt-20">
      <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
        <SectionTitle
          eyebrow="Core Proposition"
          title="把 AI 放進真實工作，而不是停在示範與話題。"
          description="OFFICE NEXT 關心的不是工具熱潮，而是白領工作者如何在日常協作、彙整、撰寫與回覆中，建立一套真正能持續使用的 AI 工作方式。"
        />
        <div className="space-y-8">
          <div className="space-y-5 text-[1rem] text-slate md:text-[1.05rem]">
            <p>
              我們將 AI 視為工作協作員，而非短期噱頭。品牌聚焦在辦公場景中的效率瓶頸，協助個人與團隊把重複工作標準化、把流程重新分工，讓人力回到更需要判斷與溝通的位置。
            </p>
            <p>
              因此，OFFICE NEXT 的內容設計、課程與顧問服務都圍繞同一件事展開：讓 AI 真正進入工作流程，而不是停留在一兩次驚艷的操作展示。
            </p>
          </div>
          <div className="rounded-[2rem] border border-ink/8 bg-[#f6f1e9] px-7 py-8">
            <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">Brand Promise</p>
            <p className="mt-3 text-xl leading-9 text-ink md:text-2xl">
              讓每一次導入 AI，都能回到商務現場可執行、可擴散、可交接的標準。
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
