export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl bg-white/70 p-7 shadow-glass backdrop-blur-md md:p-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Key Takeaways</p>
      <div className="mt-6 grid gap-3">
        {items.map((item, index) => (
          <div
            key={item}
            className="flex items-start gap-4 rounded-2xl bg-white/60 px-4 py-4 backdrop-blur-sm"
          >
            <span className="font-serif text-2xl italic leading-none text-champagne">0{index + 1}</span>
            <p className="text-base text-slate">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
