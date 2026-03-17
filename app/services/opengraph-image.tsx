import { createBrandImageResponse, ogImageContentType, ogImageSize } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OpenGraphImage() {
  return createBrandImageResponse({
    eyebrow: "Services",
    title: "服務項目",
    description: "AI 顧問、品牌設計與企業合作"
  });
}
