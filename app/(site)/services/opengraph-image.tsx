import { createBrandImageResponse, ogImageContentType, ogImageSize } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OpenGraphImage() {
  return createBrandImageResponse({
    eyebrow: "Services",
    title: "課程與服務",
    description: "ChatGPT 工作應用、GAS 辦公降載、Agent 高效槓桿與企業 AI 內訓"
  });
}
