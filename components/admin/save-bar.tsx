"use client";

type SaveBarProps = {
  status: "idle" | "saving" | "saved" | "error";
  error?: string;
  onSave: () => void;
};

const statusLabel = {
  idle: "尚未儲存",
  saving: "儲存中",
  saved: "已儲存",
  error: "儲存失敗"
} as const;

export function SaveBar({ status, error, onSave }: SaveBarProps) {
  return (
    <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-[1.6rem] border border-ink/10 bg-white/92 p-4 shadow-[0_22px_60px_rgba(17,17,17,0.08)] backdrop-blur">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-bronze">Content Status</p>
          <p className="mt-1 text-sm text-slate">{statusLabel[status]}</p>
          {error ? <p className="mt-1 text-sm text-red-700">{error}</p> : null}
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={status === "saving"}
          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium tracking-[0.18em] text-paper transition hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "saving" ? "儲存中" : "儲存變更"}
        </button>
      </div>
    </div>
  );
}
