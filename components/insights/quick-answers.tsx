import { AnswerBlocks } from "@/components/ui/answer-blocks";

export type ArticleQuickAnswer = {
  question: string;
  answer: string;
};

export function ArticleQuickAnswers({ items }: { items: ArticleQuickAnswer[] }) {
  return (
    <section className="rounded-2xl bg-white/70 p-7 shadow-glass backdrop-blur-md md:p-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Quick Answers</p>
      <div className="mt-6">
        <AnswerBlocks items={items} />
      </div>
    </section>
  );
}
