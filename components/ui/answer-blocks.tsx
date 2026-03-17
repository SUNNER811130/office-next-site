type AnswerItem = {
  question: string;
  answer: string;
};

export function AnswerBlocks({
  items,
  columns = 2
}: {
  items: AnswerItem[];
  columns?: 1 | 2;
}) {
  return (
    <div className={columns === 2 ? "grid gap-5 md:grid-cols-2" : "grid gap-5"}>
      {items.map((item, index) => (
        <article
          key={item.question}
          className="rounded-[2rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,241,233,0.96))] px-6 py-6 shadow-[0_20px_55px_rgba(17,17,17,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-ink/14 hover:shadow-[0_26px_65px_rgba(17,17,17,0.09)]"
        >
          <p className="font-serif text-3xl italic leading-none text-bronze">0{index + 1}</p>
          <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-bronze/90">Question</p>
          <h3 className="mt-3 text-[1.2rem] font-medium leading-8 text-ink">{item.question}</h3>
          <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-bronze/90">Answer</p>
          <p className="mt-3 text-base text-slate">{item.answer}</p>
        </article>
      ))}
    </div>
  );
}
