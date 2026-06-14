import Image from "next/image";
import Link from "next/link";

import { readContent } from "@/lib/content-store";

import { Container } from "../ui/container";

function socialItems(social: Awaited<ReturnType<typeof readContent>>["social"]) {
  return [
    { label: "LinkedIn", url: social.linkedin },
    { label: "Facebook", url: social.facebook },
    { label: "Instagram", url: social.instagram },
    { label: "Threads", url: social.threads },
    { label: "YouTube", url: social.youtube },
    { label: "X", url: social.x },
    ...social.other.map((item) => ({ label: item.label, url: item.url }))
  ].filter((item) => item.url);
}

export async function Footer() {
  const content = await readContent();
  const socials = socialItems(content.social);

  return (
    <footer className="bg-midnight/[0.03] py-14 md:py-16">
      <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-5">
          {content.brand.logoWordmarkUrl ? (
            <Image
              src={content.brand.logoWordmarkUrl}
              alt="OFFICE NEXT 辦公進化所 Logo"
              width={400}
              height={100}
              className="h-8 w-auto max-w-[220px] object-contain"
            />
          ) : (
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-midnight">
              {content.brand.shortName}
            </p>
          )}
          <p className="max-w-2xl text-base text-slate">{content.brand.summary}</p>
          <p className="text-sm tracking-[0.14em] text-slate">
            {content.brand.positioning}
            <br />
            {content.brand.proposition}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-champagne">Explore</p>
          <nav aria-label="頁尾導覽" className="grid gap-3 text-sm text-slate">
            {content.navigation.footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-midnight">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-champagne">Contact</p>
          <div className="space-y-3 text-sm text-slate">
            <p>{content.siteUrl}</p>
            <Link href={`mailto:${content.contact.email}`} className="transition hover:text-midnight">
              {content.contact.email}
            </Link>
            {socials.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socials.map((item) => (
                  <Link key={item.label} href={item.url} className="transition hover:text-midnight">
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </footer>
  );
}
