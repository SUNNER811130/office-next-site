import { Card } from "../ui/card";
import { Section } from "../ui/section";
import { SectionTitle } from "../ui/section-title";

const services = [
  {
    label: "AI 工作盤點",
    description: "盤點個人或團隊中高頻重複工作的節點，找出最值得先交給 AI 的工作環節。"
  },
  {
    label: "流程與指令設計",
    description: "從任務拆解、提示設計到輸出格式，建立更穩定的 AI 協作方式，而不是零散試用。"
  },
  {
    label: "部門應用情境整理",
    description: "針對行政、營運、行銷、專案與管理層常見場景，整理可實際採用的工作模組。"
  },
  {
    label: "內部落地與推進",
    description: "讓 AI 導入不只停在個人熟悉，而能延伸到團隊共識、操作標準與實際執行。"
  }
];

export function ServicesOverviewSection() {
  return (
    <Section surface="muted">
      <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <SectionTitle
          eyebrow="How We Help"
          title="從工具使用，走向工作方法升級。"
          description="OFFICE NEXT 的服務重點不是多教幾個指令，而是協助你把 AI 安放進工作流程，形成一套更成熟、更可複製的做事方式。"
        />
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((item) => (
            <Card key={item.label} className="flex min-h-[220px] flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(247,241,233,0.96))]">
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">{item.label}</p>
              <p className="mt-8 text-lg text-slate">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
