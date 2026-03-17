import path from "path";

import { del, list, put } from "@vercel/blob";

import type { MediaCategory } from "@/types/content";

export type MediaAsset = {
  key: string;
  url: string;
  filename: string;
  contentType: string;
  size?: number;
  uploadedAt?: string;
  category: MediaCategory;
  label?: string;
  source: "blob" | "fallback";
  canDelete: boolean;
};

export type UploadAssetOptions = {
  pathname?: string;
  category?: MediaCategory;
  overwrite?: boolean;
  suggestedUsage?: string;
};

export type MediaStoreAdapter = {
  kind: "blob" | "fallback";
  isConfigured: boolean;
  uploadAsset(file: File, options?: UploadAssetOptions): Promise<MediaAsset>;
  deleteAsset(key: string): Promise<void>;
  listAssets(prefix?: string): Promise<MediaAsset[]>;
};

type FallbackAssetDefinition = {
  key: string;
  url: string;
  contentType: string;
  category: MediaCategory;
  label: string;
};

const fallbackAssets: FallbackAssetDefinition[] = [
  { key: "brand/logo-wordmark.svg", url: "/brand/logo-wordmark.svg", contentType: "image/svg+xml", category: "brand", label: "logo-wordmark" },
  { key: "brand/logo-mark.svg", url: "/brand/logo-mark.svg", contentType: "image/svg+xml", category: "brand", label: "logo-mark" },
  { key: "og/og-default.svg", url: "/og/og-default.svg", contentType: "image/svg+xml", category: "og", label: "og-default" },
  { key: "people/founder-hero.svg", url: "/people/founder-hero.svg", contentType: "image/svg+xml", category: "people", label: "founder-hero" },
  { key: "people/founder-portrait.svg", url: "/people/founder-portrait.svg", contentType: "image/svg+xml", category: "people", label: "founder-portrait" },
  { key: "sections/advisory-01.svg", url: "/sections/advisory-01.svg", contentType: "image/svg+xml", category: "sections", label: "advisory-01" },
  { key: "sections/workshop-01.svg", url: "/sections/workshop-01.svg", contentType: "image/svg+xml", category: "sections", label: "workshop-01" },
  { key: "sections/strategy-session-01.svg", url: "/sections/strategy-session-01.svg", contentType: "image/svg+xml", category: "sections", label: "strategy-session-01" },
  { key: "logos/client-01.svg", url: "/logos/client-01.svg", contentType: "image/svg+xml", category: "logos", label: "client-01" },
  { key: "logos/client-02.svg", url: "/logos/client-02.svg", contentType: "image/svg+xml", category: "logos", label: "client-02" },
  { key: "logos/client-03.svg", url: "/logos/client-03.svg", contentType: "image/svg+xml", category: "logos", label: "client-03" }
];

function categoryFromPathname(pathnameValue: string): MediaCategory {
  const top = pathnameValue.split("/")[0];
  if (top === "people" || top === "sections" || top === "logos" || top === "og" || top === "brand") {
    return top;
  }

  return "sections";
}

function sanitizeFilename(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildPathname(file: File, options?: UploadAssetOptions) {
  if (options?.pathname) {
    return options.pathname;
  }

  const category = options?.category ?? "sections";
  const extension = path.extname(file.name) || ".bin";
  const basename = sanitizeFilename(path.basename(file.name, extension)) || "asset";
  return `${category}/${basename}${extension.toLowerCase()}`;
}

function inferContentTypeFromFilename(filename: string) {
  const extension = path.extname(filename).toLowerCase();
  switch (extension) {
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

const fallbackAdapter: MediaStoreAdapter = {
  kind: "fallback",
  isConfigured: false,
  async uploadAsset() {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing. Upload is unavailable until Vercel Blob is configured.");
  },
  async deleteAsset() {
    throw new Error("Fallback assets are read-only and cannot be deleted.");
  },
  async listAssets(prefix = "") {
    return fallbackAssets
      .filter((asset) => asset.key.startsWith(prefix))
      .map((asset) => ({
        key: asset.key,
        url: asset.url,
        filename: asset.key.split("/").pop() ?? asset.key,
        contentType: asset.contentType,
        category: asset.category,
        label: asset.label,
        source: "fallback" as const,
        canDelete: false
      }));
  }
};

const blobAdapter: MediaStoreAdapter = {
  kind: "blob",
  isConfigured: true,
  async uploadAsset(file, options) {
    const pathnameValue = buildPathname(file, options);
    const blob = await put(pathnameValue, file, {
      access: "public",
      addRandomSuffix: options?.overwrite ? false : true,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return {
      key: blob.pathname,
      url: blob.url,
      filename: blob.pathname.split("/").pop() ?? blob.pathname,
      contentType: file.type || "application/octet-stream",
      size: file.size,
      uploadedAt: new Date().toISOString(),
      category: categoryFromPathname(blob.pathname),
      label: options?.suggestedUsage,
      source: "blob",
      canDelete: true
    };
  },
  async deleteAsset(key) {
    const assetUrl = key.startsWith("http")
      ? key
      : (await list({ prefix: key, token: process.env.BLOB_READ_WRITE_TOKEN })).blobs.find(
          (blob) => blob.pathname === key
        )?.url;

    if (!assetUrl) {
      throw new Error("Asset not found.");
    }

    await del(assetUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
  },
  async listAssets(prefix = "") {
    const result = await list({
      prefix,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return result.blobs.map((blob) => ({
      key: blob.pathname,
      url: blob.url,
      filename: blob.pathname.split("/").pop() ?? blob.pathname,
      contentType: inferContentTypeFromFilename(blob.pathname),
      size: blob.size,
      uploadedAt: blob.uploadedAt?.toISOString(),
      category: categoryFromPathname(blob.pathname),
      source: "blob" as const,
      canDelete: true
    }));
  }
};

export function getMediaStore(): MediaStoreAdapter {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return blobAdapter;
  }

  return fallbackAdapter;
}

export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uploadAsset(file: File, options?: UploadAssetOptions) {
  return getMediaStore().uploadAsset(file, options);
}

export async function deleteAsset(key: string) {
  return getMediaStore().deleteAsset(key);
}

export async function listAssets(prefix?: string) {
  const adapter = getMediaStore();
  const fromAdapter = await adapter.listAssets(prefix);

  if (adapter.kind === "blob") {
    const fallback = await fallbackAdapter.listAssets(prefix);
    return [...fromAdapter, ...fallback];
  }

  return fromAdapter;
}

export const mediaNamingSuggestions = [
  "brand/logo-wordmark.svg",
  "brand/logo-mark.svg",
  "brand/og-default.png",
  "people/founder-hero.webp",
  "people/founder-portrait.webp",
  "sections/advisory-01.webp",
  "sections/workshop-01.webp",
  "sections/strategy-session-01.webp",
  "logos/client-01.svg",
  "logos/client-02.svg",
  "logos/client-03.svg"
];
