"use client";

import { useState } from "react";

import { MediaGallery } from "@/components/admin/media-gallery";
import { MediaUploader } from "@/components/admin/media-uploader";
import type { MediaCategory } from "@/types/content";

type MediaPickerProps = {
  label: string;
  value: string;
  category: MediaCategory;
  suggestedPath?: string;
  onChange: (value: string) => void;
};

export function MediaPicker({
  label,
  value,
  category,
  suggestedPath,
  onChange
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="grid gap-3 rounded-[1.5rem] border border-ink/8 bg-white/70 p-4">
      <label className="grid gap-2 text-sm text-slate">
        <span>{label}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={suggestedPath || "https://... 或 /path"}
          className="rounded-[1.2rem] border border-ink/10 bg-[#fcfaf7] px-4 py-3 text-base text-ink outline-none transition focus:border-ink/25 focus:bg-white"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="rounded-full border border-ink/10 px-4 py-2 text-sm tracking-[0.12em] text-ink"
        >
          {open ? "收起媒體庫" : "開啟媒體庫"}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-full border border-ink/10 px-4 py-2 text-sm tracking-[0.12em] text-slate"
          >
            清空
          </button>
        ) : null}
      </div>

      {value ? (
        <div className="overflow-hidden rounded-[1.2rem] border border-ink/8 bg-stone">
          <img src={value} alt={label} className="h-48 w-full object-cover" />
        </div>
      ) : null}

      {open ? (
        <div className="grid gap-4 border-t border-ink/8 pt-4">
          <MediaUploader
            category={category}
            suggestedPath={suggestedPath}
            suggestedUsage={label}
            onUploaded={(url) => {
              onChange(url);
              setRefreshKey((current) => current + 1);
            }}
          />
          <MediaGallery
            prefix={category}
            refreshKey={refreshKey}
            onSelect={(asset) => {
              onChange(asset.url);
              setOpen(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
