import { Card } from "../ui/card";
import { Section } from "../ui/section";
import { SectionTitle } from "../ui/section-title";

const services = [
  "從正確使用 GPT 到日常工作實戰，幫助個人把 AI 變成可靠的工作協作員。",
  "聚焦真實工作情境，透過案例與操作，建立可立即上手的方法與流程。",
  "協助團隊理解 AI 的導入方式，從工作習慣、協作流程到部門效率全面升級。",
  "針對特定工作場景，重新梳理任務流程，找出可被 AI 協作與優化的關鍵節點。"
];

export function ServicesOverviewSection() {
  return (
    <Section surface="muted">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionTitle
          eyebrow="How We Help"
          title="從瞎忙，到智動"
          description="OFFICE NEXT 提供的不只是工具教學，而是一套更適合白領的工作升級方法。"
        />
        <div className="grid gap-5">
          {services.map((item) => (
            <Card key={item} className="bg-[#fcfaf7]">
              <p className="text-lg leading-8 text-slate">{item}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
