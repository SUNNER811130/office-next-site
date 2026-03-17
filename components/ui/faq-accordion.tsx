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
          className="group rounded-[2rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,233,0.98))] px-6 py-5 shadow-[0_18px_48px_rgba(17,17,17,0.05)] transition duration-300 open:border-ink/14 open:shadow-[0_26px_70px_rgba(17,17,17,0.08)]"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-bronze/90">FAQ 0{index + 1}</p>
              <h3 className="mt-3 text-[1.18rem] font-medium leading-8 text-ink">{item.question}</h3>
            </div>
            <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/8 bg-white/70 text-xl leading-none text-slate transition duration-300 group-open:rotate-45 group-open:text-ink">
              +
            </span>
          </summary>
          <div className="overflow-hidden">
            <p className="mt-5 max-w-[52rem] border-t border-ink/8 pt-5 text-base text-slate">
              {item.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
