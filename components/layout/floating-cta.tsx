import { readContent } from "@/lib/content-store";

import { ButtonLink } from "@/components/ui/button";

export async function FloatingCta() {
  const content = await readContent();
  if (!content.design.floatingCta.enabled) return null;

  return (
    <>
      <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden lg:block">
        <div className="site-floating-cta pointer-events-auto rounded-2xl bg-white/70 shadow-elegant backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Start Here</p>
          <div className="mt-3 grid gap-2">
            <ButtonLink href="/contact" className="px-5 py-3">
              {content.contact.mailtoLabel}
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary" className="px-5 py-3">
              查看服務
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 lg:hidden">
        <div className="site-floating-cta rounded-2xl border border-white/70 bg-white/88 shadow-elegant backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2">
            <ButtonLink href="/contact" className="px-3 py-2.5 text-[11px] tracking-[0.1em]">
              寄信洽詢
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary" className="px-3 py-2.5 text-[11px] tracking-[0.1em]">
              查看服務
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
