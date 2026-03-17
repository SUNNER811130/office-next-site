export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <section className="rounded-[2.4rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,241,233,0.98))] p-7 shadow-[0_22px_58px_rgba(17,17,17,0.05)] md:p-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Key Takeaways</p>
      <div className="mt-6 grid gap-3">
        {items.map((item, index) => (
          <div
            key={item}
            className="flex items-start gap-4 rounded-[1.4rem] border border-ink/8 bg-white/72 px-4 py-4"
          >
            <span className="font-serif text-2xl italic leading-none text-bronze">0{index + 1}</span>
            <p className="text-base text-slate">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
