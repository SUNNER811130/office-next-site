import type { ContentScope } from "@/types/content-workflow";

export const adminPreviewTargets = ["home", "services", "about", "contact"] as const;

export type AdminPreviewTarget = (typeof adminPreviewTargets)[number];

export type AdminPreviewTargetConfig = {
  label: string;
  publicPath: string;
  scopes: readonly ContentScope[];
};
