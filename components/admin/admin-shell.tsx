import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";
import { logoutAdmin } from "@/lib/admin-auth";

export function AdminShell({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  async function logoutAction() {
    "use server";
    await logoutAdmin();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f3ec_0%,#f4ede4_48%,#f8f4ef_100%)]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr] lg:px-6">
        <AdminNav logoutAction={logoutAction} />
        <div className="grid gap-5">
          <header className="rounded-[2rem] border border-ink/8 bg-white/86 px-6 py-6 shadow-[0_20px_60px_rgba(17,17,17,0.04)] backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Admin Section</p>
            <h1 className="mt-3 text-[2rem] font-medium leading-tight text-ink md:text-[2.6rem]">{title}</h1>
            {description ? <p className="mt-3 max-w-3xl text-base text-slate">{description}</p> : null}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
