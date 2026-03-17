import { ButtonLink } from "../ui/button";
import { Container } from "../ui/container";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
};

export function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-ink/6 bg-[#f6f1e9] py-20 md:py-28 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_40%)]" />
      <div className="absolute inset-0 bg-hero-grid bg-[size:72px_72px] opacity-[0.06]" />
      <Container className="relative">
        <div className="max-w-[920px]">
          <p className="text-[11px] uppercase tracking-[0.34em] text-bronze">{eyebrow}</p>
          <h1 className="mt-5 max-w-[12ch] text-balance text-[2.8rem] font-medium leading-[1.08] text-ink md:text-[4.6rem] lg:text-[5.2rem]">
            {title}
          </h1>
          <p className="mt-7 max-w-[42rem] text-[1.05rem] text-slate md:text-[1.15rem]">
            {description}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {primaryCta ? <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink> : null}
              {secondaryCta ? (
                <ButtonLink href={secondaryCta.href} variant="secondary">
                  {secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
