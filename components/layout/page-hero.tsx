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
    <section className="border-b border-ink/8 bg-[#f6f2eb] py-20 md:py-28">
      <Container className="max-w-5xl">
        <p className="text-xs uppercase tracking-[0.32em] text-bronze">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-balance text-4xl font-medium leading-tight text-ink md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate">{description}</p>
        {(primaryCta || secondaryCta) && (
          <div className="mt-10 flex flex-wrap gap-4">
            {primaryCta ? <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink> : null}
            {secondaryCta ? (
              <ButtonLink href={secondaryCta.href} variant="secondary">
                {secondaryCta.label}
              </ButtonLink>
            ) : null}
          </div>
        )}
      </Container>
    </section>
  );
}
