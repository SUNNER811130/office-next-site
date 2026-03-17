import { createBrandImageResponse, ogImageContentType, ogImageSize } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OpenGraphImage() {
  return createBrandImageResponse({
    eyebrow: "Corporate Training",
    title: "企業內訓",
    description: "面向管理者與白領團隊的 AI 訓練"
  });
}
