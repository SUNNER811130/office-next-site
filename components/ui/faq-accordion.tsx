type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({
  items,
  firstOpen = false
}: {
  items: FaqItem[];
  firstOpen?: boolean;
}) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <details
          key={item.question}
          open={firstOpen && index === 0}
          className="group rounded-2xl border border-white/70 bg-white/72 px-6 py-5 shadow-glass backdrop-blur-xl transition-all duration-300 open:border-champagne/25 open:shadow-glass-hover motion-reduce:transition-none"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">FAQ 0{index + 1}</p>
              <h3 className="mt-3 text-[1.18rem] font-medium leading-8 text-midnight">{item.question}</h3>
            </div>
            <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-midnight/8 bg-oat text-xl leading-none text-slate transition duration-300 group-open:rotate-45 group-open:border-champagne/35 group-open:bg-champagne/10 group-open:text-midnight motion-reduce:transition-none">
              +
            </span>
          </summary>
          <div className="overflow-hidden">
            <p className="mt-5 max-w-[52rem] border-t border-midnight/8 pt-5 text-base text-slate">
              {item.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
