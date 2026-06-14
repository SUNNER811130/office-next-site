import { createBrandImageResponse, ogImageContentType, ogImageSize } from "@/lib/og";
import { brandEntity } from "@/lib/site";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OpenGraphImage() {
  return createBrandImageResponse({
    eyebrow: "OFFICE NEXT",
    title: "白領 AI 提效與辦公自動化",
    description: brandEntity.shortDescription
  });
}
