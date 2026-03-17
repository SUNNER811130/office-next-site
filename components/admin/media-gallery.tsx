"use client";

import { useEffect, useState } from "react";

import type { MediaAsset } from "@/lib/media-store";

type MediaGalleryProps = {
  prefix?: string;
  onSelect?: (asset: MediaAsset) => void;
  refreshKey?: number;
};

export function MediaGallery({ prefix = "", onSelect, refreshKey = 0 }: MediaGalleryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch(`/api/admin/media?prefix=${encodeURIComponent(prefix)}`)
      .then(async (response) => {
        const result = (await response.json()) as { assets?: MediaAsset[]; error?: string };
        if (!active) {
          return;
        }

        if (!response.ok || !result.assets) {
          setError(result.error || "無法載入媒體列表");
          return;
        }

        setAssets(result.assets);
        setError("");
      })
      .catch(() => {
        if (active) {
          setError("無法載入媒體列表");
        }
      });

    return () => {
      active = false;
    };
  }, [prefix, refreshKey]);

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {assets.map((asset) => (
        <article key={`${asset.source}-${asset.key}`} className="rounded-[1.5rem] border border-ink/8 bg-white/80 p-3">
          <div className="aspect-[4/3] overflow-hidden rounded-[1rem] bg-stone">
            <img src={asset.url} alt={asset.filename} className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 grid gap-2 text-sm text-slate">
            <p className="font-medium text-ink">{asset.filename}</p>
            <p>{asset.url}</p>
            <p>
              {asset.contentType} · {asset.category} · {asset.source}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(asset)}
                className="rounded-full bg-ink px-3 py-2 text-xs tracking-[0.16em] text-paper"
              >
                套用到欄位
              </button>
            ) : null}
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(asset.url);
              }}
              className="rounded-full border border-ink/10 px-3 py-2 text-xs tracking-[0.16em] text-slate"
            >
              複製 URL
            </button>
            {asset.canDelete ? (
              <button
                type="button"
                onClick={async () => {
                  await fetch(`/api/admin/media?key=${encodeURIComponent(asset.key)}`, { method: "DELETE" });
                  setAssets((current) => current.filter((item) => item.key !== asset.key));
                }}
                className="rounded-full border border-red-200 px-3 py-2 text-xs tracking-[0.16em] text-red-700"
              >
                刪除
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
