import { ButtonLink } from "@/components/ui/button";

export function ArticleCta({
  title,
  description,
  primary,
  secondary
}: {
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}) {
  return (
    <section className="rounded-[2.8rem] border border-white/10 bg-[linear-gradient(135deg,#121212_0%,#1d1b1a_45%,#2a241f_100%)] px-8 py-12 text-paper shadow-[0_36px_90px_rgba(17,17,17,0.18)] md:px-12 md:py-14">
      <p className="text-[11px] uppercase tracking-[0.32em] text-[#d7c5ab]">Next Step</p>
      <h2 className="mt-5 max-w-[12ch] text-balance text-[2.2rem] font-medium leading-[1.08] md:text-[3.8rem]">
        {title}
      </h2>
      <p className="mt-6 max-w-[38rem] text-[1rem] text-[#e7ded3] md:text-[1.06rem]">{description}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ButtonLink href={primary.href} className="bg-paper text-ink hover:bg-white">
          {primary.label}
        </ButtonLink>
        <ButtonLink
          href={secondary.href}
          variant="secondary"
          className="border-white/16 bg-white/8 text-paper hover:bg-white/14 hover:text-paper"
        >
          {secondary.label}
        </ButtonLink>
      </div>
    </section>
  );
}
