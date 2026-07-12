import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/design", label: "視覺設計" },
  { href: "/admin/pages/home", label: "首頁區塊" },
  { href: "/admin/pages/services", label: "服務頁區塊" },
  { href: "/admin/pages/about", label: "關於頁區塊" },
  { href: "/admin/pages/contact", label: "聯絡頁區塊" },
  { href: "/admin/brand", label: "Brand" },
  { href: "/admin/home", label: "Home" },
  { href: "/admin/founder", label: "Founder" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/cases", label: "Cases" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/insights", label: "Insights" },
  { href: "/admin/media", label: "Media" }
];

export function AdminNav({
  logoutAction
}: {
  logoutAction: () => Promise<void>;
}) {
  return (
    <aside className="rounded-[2rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,238,231,0.94))] p-5 shadow-[0_24px_70px_rgba(17,17,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">Office Next Admin</p>
      <nav className="mt-5 grid gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[1.2rem] px-4 py-3 text-sm text-slate transition hover:bg-white hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <form action={logoutAction} className="mt-6">
        <button
          type="submit"
          className="w-full rounded-full border border-ink/10 px-4 py-3 text-sm tracking-[0.14em] text-ink transition hover:border-ink/20 hover:bg-white"
        >
          登出
        </button>
      </form>
    </aside>
  );
}
