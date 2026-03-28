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
          className="rounded-2xl bg-white/70 px-6 py-6 shadow-glass backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glass-hover"
        >
          <p className="font-serif text-3xl italic leading-none text-champagne">0{index + 1}</p>
          <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-champagne">Question</p>
          <h3 className="mt-3 text-[1.2rem] font-medium leading-8 text-midnight">{item.question}</h3>
          <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-champagne">Answer</p>
          <p className="mt-3 text-base text-slate">{item.answer}</p>
        </article>
      ))}
    </div>
  );
}
