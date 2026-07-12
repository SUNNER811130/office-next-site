import type { PageBlockBackground, PageBlockLayout, PageBlockMotion } from "@/types/content";

export const pageBlockPreviewDevices = [
  { label: "手機", width: 390 },
  { label: "平板", width: 768 },
  { label: "桌機", width: 1280 }
] as const;

export const pageBlockBackgroundOptions: readonly { value: PageBlockBackground; label: string }[] = [
  { value: "default", label: "原始背景" },
  { value: "clean", label: "冷白純淨" },
  { value: "soft-grid", label: "柔和科技網格" },
  { value: "soft-blue", label: "極淡藍灰" },
  { value: "deep-panel", label: "深藍科技面板" }
];

export const pageBlockMotionOptions: readonly { value: PageBlockMotion; label: string }[] = [
  { value: "inherit", label: "沿用全站" },
  { value: "none", label: "無動畫" },
  { value: "fade", label: "淡入" },
  { value: "fly-up", label: "向上淡入" },
  { value: "fly-left", label: "由左淡入" },
  { value: "fly-right", label: "由右淡入" }
];

export const pageBlockLayoutLabels: Record<PageBlockLayout, string> = {
  default: "原始版型",
  contained: "收斂容器",
  wide: "寬版容器",
  "single-column": "單欄",
  "two-column": "雙欄"
};
