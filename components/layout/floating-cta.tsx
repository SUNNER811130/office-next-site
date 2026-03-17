import { readContent } from "@/lib/content-store";

import { ButtonLink } from "@/components/ui/button";

export async function FloatingCta() {
  const content = await readContent();

  return (
    <>
      <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden lg:block">
        <div className="pointer-events-auto rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(246,239,230,0.96))] p-4 shadow-[0_24px_70px_rgba(17,17,17,0.12)] backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Start Here</p>
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

      <div className="fixed inset-x-4 bottom-4 z-40 lg:hidden">
        <div className="rounded-full border border-white/70 bg-paper/92 px-3 py-3 shadow-[0_18px_50px_rgba(17,17,17,0.12)] backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2">
            <ButtonLink href="/contact" className="px-4 py-3 text-[12px]">
              寄信洽詢
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary" className="px-4 py-3 text-[12px]">
              查看服務
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
