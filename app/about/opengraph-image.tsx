import { createBrandImageResponse, ogImageContentType, ogImageSize } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OpenGraphImage() {
  return createBrandImageResponse({
    eyebrow: "About OFFICE NEXT",
    title: "關於 OFFICE NEXT",
    description: "品牌定位、品牌主張與方法論"
  });
}
