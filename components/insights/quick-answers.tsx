import { AnswerBlocks } from "@/components/ui/answer-blocks";

export type ArticleQuickAnswer = {
  question: string;
  answer: string;
};

export function ArticleQuickAnswers({ items }: { items: ArticleQuickAnswer[] }) {
  return (
    <section className="rounded-[2.4rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,233,0.98))] p-7 shadow-[0_22px_58px_rgba(17,17,17,0.05)] md:p-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Quick Answers</p>
      <div className="mt-6">
        <AnswerBlocks items={items} />
      </div>
    </section>
  );
}
