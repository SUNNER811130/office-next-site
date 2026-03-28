import path from "path";

import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

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
  source: "s3" | "fallback";
  canDelete: boolean;
};

export type UploadAssetOptions = {
  pathname?: string;
  category?: MediaCategory;
  overwrite?: boolean;
  suggestedUsage?: string;
};

export type MediaStoreAdapter = {
  kind: "s3" | "fallback";
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
  
  if (options?.overwrite) {
    return `${category}/${basename}${extension.toLowerCase()}`;
  }
  
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${category}/${basename}-${randomSuffix}${extension.toLowerCase()}`;
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
    throw new Error("R2 is not configured. Upload is unavailable.");
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

let s3ClientInstance: S3Client | null = null;
function getS3Client() {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || ""
      }
    });
  }
  return s3ClientInstance;
}

const s3Adapter: MediaStoreAdapter = {
  kind: "s3",
  isConfigured: true,
  async uploadAsset(file, options) {
    const s3Client = getS3Client();
    const pathnameValue = buildPathname(file, options);
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: pathnameValue,
        Body: buffer,
        ContentType: file.type || "application/octet-stream"
      })
    );

    const publicDomain = process.env.R2_PUBLIC_DOMAIN?.replace(/\/+$/, "");
    const url = `${publicDomain}/${pathnameValue}`;

    return {
      key: pathnameValue,
      url,
      filename: pathnameValue.split("/").pop() ?? pathnameValue,
      contentType: file.type || "application/octet-stream",
      size: file.size,
      uploadedAt: new Date().toISOString(),
      category: categoryFromPathname(pathnameValue),
      label: options?.suggestedUsage,
      source: "s3",
      canDelete: true
    };
  },
  async deleteAsset(key) {
    const s3Client = getS3Client();
    let actualKey = key;
    
    // If key is a full URL, extract the path
    const publicDomain = process.env.R2_PUBLIC_DOMAIN?.replace(/\/+$/, "") || "";
    if (key.startsWith("http") && publicDomain && key.startsWith(publicDomain)) {
      actualKey = key.slice(publicDomain.length + 1);
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: actualKey
      })
    );
  },
  async listAssets(prefix = "") {
    const s3Client = getS3Client();
    const result = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
        Prefix: prefix
      })
    );

    const publicDomain = process.env.R2_PUBLIC_DOMAIN?.replace(/\/+$/, "");

    return (result.Contents || []).map((item) => {
      const pathname = item.Key || "";
      return {
        key: pathname,
        url: `${publicDomain}/${pathname}`,
        filename: pathname.split("/").pop() ?? pathname,
        contentType: inferContentTypeFromFilename(pathname),
        size: item.Size,
        uploadedAt: item.LastModified?.toISOString(),
        category: categoryFromPathname(pathname),
        source: "s3" as const,
        canDelete: true
      };
    });
  }
};

export function getMediaStore(): MediaStoreAdapter {
  if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
    return s3Adapter;
  }

  return fallbackAdapter;
}

export function isBlobConfigured() {
  return Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY);
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

  if (adapter.kind === "s3") {
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
