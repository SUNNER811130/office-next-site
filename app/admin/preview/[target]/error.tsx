"use client";

export default function AdminPreviewError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-paper p-6">
      <div role="alert" className="max-w-lg rounded-2xl border border-red-900/15 bg-white p-6 text-center">
        <h1 className="text-xl font-medium text-ink">預覽暫時無法載入</h1>
        <p className="mt-3 text-sm text-slate">請確認管理員登入狀態後再試一次；目前內容與發布狀態都沒有變更。</p>
        <button type="button" onClick={reset} className="mt-5 rounded-full border border-ink/10 px-4 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40">
          重新載入預覽
        </button>
      </div>
    </main>
  );
}
