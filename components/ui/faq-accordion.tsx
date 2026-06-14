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
          className="group rounded-2xl border border-white/70 bg-white/76 px-6 py-5 shadow-glass backdrop-blur-xl transition-all duration-300 open:border-champagne/35 open:bg-white/88 open:shadow-[0_14px_38px_rgba(7,26,47,0.08),0_0_0_1px_rgba(110,167,191,0.12)] motion-reduce:transition-none"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">FAQ 0{index + 1}</p>
              <h3 className="mt-3 text-[1.18rem] font-medium leading-8 text-midnight">{item.question}</h3>
            </div>
            <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-midnight/8 bg-oat text-xl leading-none text-slate transition duration-300 group-open:rotate-45 group-open:border-champagne/45 group-open:bg-champagne/12 group-open:text-midnight group-open:shadow-[0_0_22px_rgba(110,167,191,0.18)] motion-reduce:transition-none">
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
