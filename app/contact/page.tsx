import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Contact",
  description: "聯絡 OFFICE NEXT 辦公進化所，洽詢課程、企業內訓與合作方案。"
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="如果你準備開始升級工作方式，我們可以從這裡開始。"
        description="歡迎洽詢課程、企業內訓與合作需求。第一版網站先提供簡潔聯絡入口，後續可再接表單、CRM 或行銷自動化流程。"
      />
      <Section>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="bg-[#f6f2eb]">
            <p className="text-sm uppercase tracking-[0.3em] text-bronze">Contact Info</p>
            <div className="mt-8 space-y-6 text-base leading-8 text-slate">
              <p>品牌：OFFICE NEXT 辦公進化所</p>
              <p>合作類型：課程、企業內訓、顧問型工作流程優化</p>
              <p>信箱：hello@officenext.tw</p>
            </div>
          </Card>
          <Card>
            <form className="grid gap-5">
              <label className="grid gap-2 text-sm tracking-[0.14em] text-slate">
                姓名
                <input
                  className="rounded-2xl border border-ink/10 bg-[#fcfaf7] px-5 py-4 text-base text-ink outline-none transition focus:border-ink/30"
                  placeholder="請輸入姓名"
                />
              </label>
              <label className="grid gap-2 text-sm tracking-[0.14em] text-slate">
                Email
                <input
                  type="email"
                  className="rounded-2xl border border-ink/10 bg-[#fcfaf7] px-5 py-4 text-base text-ink outline-none transition focus:border-ink/30"
                  placeholder="name@company.com"
                />
              </label>
              <label className="grid gap-2 text-sm tracking-[0.14em] text-slate">
                需求說明
                <textarea
                  rows={6}
                  className="rounded-[1.5rem] border border-ink/10 bg-[#fcfaf7] px-5 py-4 text-base text-ink outline-none transition focus:border-ink/30"
                  placeholder="請簡單描述你的需求、團隊規模或合作方向"
                />
              </label>
              <div className="pt-2">
                <Button type="submit">送出洽詢</Button>
              </div>
            </form>
          </Card>
        </div>
      </Section>
    </>
  );
}
