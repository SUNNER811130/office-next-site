import { createBrandImageResponse, ogImageContentType, ogImageSize } from "@/lib/og";
import { brandEntity } from "@/lib/site";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OpenGraphImage() {
  return createBrandImageResponse({
    eyebrow: "OFFICE NEXT",
    title: "白領工作與 AI 策略顧問",
    description: brandEntity.shortDescription
  });
}
