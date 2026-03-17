import { redirect } from "next/navigation";

import { getAdminEnvStatus, isAdminAuthenticated, loginAdmin } from "@/lib/admin-auth";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const { error } = await searchParams;
  const envStatus = getAdminEnvStatus();

  async function loginAction(formData: FormData) {
    "use server";

    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");
    const ok = await loginAdmin(username, password);

    if (!ok) {
      redirect("/admin/login?error=invalid");
    }

    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7f1e8_0%,#f2ebe1_48%,#f8f4ef_100%)] px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-ink/8 bg-white/92 p-8 shadow-[0_28px_80px_rgba(17,17,17,0.08)]">
        <p className="text-[11px] uppercase tracking-[0.34em] text-bronze">Office Next Admin</p>
        <h1 className="mt-4 text-[2rem] font-medium text-ink">登入後台</h1>
        <p className="mt-3 text-sm text-slate">使用伺服器端驗證與 HttpOnly cookie session。</p>

        {!envStatus.configured ? (
          <div className="mt-5 rounded-[1.3rem] border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            缺少必要 env：{envStatus.missing.join(", ")}
          </div>
        ) : null}

        {error === "invalid" ? (
          <div className="mt-5 rounded-[1.3rem] border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            帳號或密碼錯誤。
          </div>
        ) : null}

        <form action={loginAction} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate">
            <span>Username</span>
            <input
              name="username"
              className="rounded-[1.2rem] border border-ink/10 bg-[#fcfaf7] px-4 py-3 text-base text-ink outline-none focus:border-ink/25"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate">
            <span>Password</span>
            <input
              name="password"
              type="password"
              className="rounded-[1.2rem] border border-ink/10 bg-[#fcfaf7] px-4 py-3 text-base text-ink outline-none focus:border-ink/25"
            />
          </label>
          <button
            type="submit"
            disabled={!envStatus.configured}
            className="mt-2 rounded-full bg-ink px-5 py-3 text-sm tracking-[0.18em] text-paper disabled:cursor-not-allowed disabled:opacity-60"
          >
            登入
          </button>
        </form>
      </div>
    </div>
  );
}
