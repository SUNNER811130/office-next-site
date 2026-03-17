"use client";

import { useState } from "react";

import type { MediaCategory } from "@/types/content";

type MediaUploaderProps = {
  category: MediaCategory;
  suggestedPath?: string;
  suggestedUsage?: string;
  onUploaded: (url: string) => void;
};

export function MediaUploader({
  category,
  suggestedPath,
  suggestedUsage,
  onUploaded
}: MediaUploaderProps) {
  const [status, setStatus] = useState<string>("");

  return (
    <div className="grid gap-3 rounded-[1.4rem] border border-dashed border-ink/10 bg-white/60 p-4">
      <div>
        <p className="text-sm font-medium text-ink">上傳新資產</p>
        <p className="mt-1 text-sm text-slate">
          建議命名：<code>{suggestedPath || `${category}/your-file.ext`}</code>
        </p>
      </div>
      <input
        type="file"
        accept="image/*,.svg"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          setStatus("上傳中");
          const formData = new FormData();
          formData.append("file", file);
          formData.append("category", category);
          if (suggestedPath) {
            formData.append("pathname", suggestedPath);
          }
          if (suggestedUsage) {
            formData.append("suggestedUsage", suggestedUsage);
          }

          const response = await fetch("/api/admin/media", {
            method: "POST",
            body: formData
          });

          const result = (await response.json()) as { url?: string; error?: string };
          if (!response.ok || !result.url) {
            setStatus(result.error || "上傳失敗");
            return;
          }

          onUploaded(result.url);
          setStatus("上傳完成");
          event.target.value = "";
        }}
        className="block w-full text-sm text-slate file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:text-paper"
      />
      {status ? <p className="text-sm text-slate">{status}</p> : null}
    </div>
  );
}
