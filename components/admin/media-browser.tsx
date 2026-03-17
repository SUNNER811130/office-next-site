"use client";

import { useState } from "react";

import { MediaGallery } from "@/components/admin/media-gallery";
import { MediaUploader } from "@/components/admin/media-uploader";
import { mediaNamingSuggestions } from "@/lib/media-store";
import type { MediaCategory } from "@/types/content";

const categories: Array<{ label: string; value: "" | MediaCategory }> = [
  { label: "全部", value: "" },
  { label: "Brand", value: "brand" },
  { label: "People", value: "people" },
  { label: "Sections", value: "sections" },
  { label: "Logos", value: "logos" },
  { label: "OG", value: "og" }
];

export function MediaBrowser({ blobReady }: { blobReady: boolean }) {
  const [prefix, setPrefix] = useState<"" | MediaCategory>("");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 lg:grid-cols-2">
        <MediaUploader
          category={prefix || "brand"}
          suggestedPath={mediaNamingSuggestions.find((item) => item.startsWith(prefix || "brand"))}
          suggestedUsage="media-manager-upload"
          onUploaded={() => setRefreshKey((current) => current + 1)}
        />
        <div className="rounded-[1.5rem] border border-ink/8 bg-white/80 p-4">
          <p className="text-sm font-medium text-ink">篩選與命名</p>
          <label className="mt-4 grid gap-2 text-sm text-slate">
            <span>Prefix / Category</span>
            <select
              value={prefix}
              onChange={(event) => setPrefix(event.target.value as "" | MediaCategory)}
              className="rounded-[1.2rem] border border-ink/10 bg-[#fcfaf7] px-4 py-3 text-base text-ink outline-none"
            >
              {categories.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4 grid gap-2 text-sm text-slate">
            {mediaNamingSuggestions.map((item) => (
              <code key={item}>{item}</code>
            ))}
          </div>
          {!blobReady ? (
            <p className="mt-4 text-sm text-amber-900">
              未設定 <code>BLOB_READ_WRITE_TOKEN</code> 時，這裡只會顯示 fallback 資產。
            </p>
          ) : null}
        </div>
      </section>

      <MediaGallery prefix={prefix} refreshKey={refreshKey} />
    </div>
  );
}
