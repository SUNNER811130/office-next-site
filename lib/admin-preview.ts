import { mergeScopeValue } from "@/lib/content-scopes";
import type { ContentStoreRepository } from "@/lib/content-store";
import { getContentWorkflowRepository } from "@/lib/content-store";
import type { SiteContent } from "@/types/content";
import type { ContentScope } from "@/types/content-workflow";
import {
  adminPreviewTargets,
  type AdminPreviewTarget,
  type AdminPreviewTargetConfig
} from "@/lib/admin-preview-types";

export const adminPreviewTargetConfig = {
  home: {
    label: "首頁",
    publicPath: "/",
    scopes: ["brand", "home", "founder", "services", "cases", "testimonials", "faq", "contact", "design", "pageBlocks.home"]
  },
  services: {
    label: "服務頁",
    publicPath: "/services",
    scopes: ["brand", "services", "cases", "faq", "design", "pageBlocks.services"]
  },
  about: {
    label: "關於頁",
    publicPath: "/about",
    scopes: ["brand", "founder", "testimonials", "faq", "design", "pageBlocks.about"]
  },
  contact: {
    label: "聯絡頁",
    publicPath: "/contact",
    scopes: ["brand", "contact", "social", "faq", "design", "pageBlocks.contact"]
  }
} as const satisfies Record<AdminPreviewTarget, AdminPreviewTargetConfig>;

export function isAdminPreviewTarget(value: string): value is AdminPreviewTarget {
  return (adminPreviewTargets as readonly string[]).includes(value);
}

async function applyEditorScope<TScope extends ContentScope>(
  repository: ContentStoreRepository,
  content: SiteContent,
  scope: TScope
) {
  const snapshot = await repository.readEditor(scope);
  return {
    content: mergeScopeValue(content, scope, snapshot.data),
    isDraft: snapshot.source === "draft"
  };
}

export async function readAdminPreview(
  target: AdminPreviewTarget,
  repository: ContentStoreRepository = getContentWorkflowRepository()
) {
  const config = adminPreviewTargetConfig[target];
  let content = (await repository.readPublished()).content;
  const draftScopes: ContentScope[] = [];

  for (const scope of config.scopes) {
    const result = await applyEditorScope(repository, content, scope);
    content = result.content;
    if (result.isDraft) draftScopes.push(scope);
  }

  return {
    target,
    content,
    source: draftScopes.length > 0 ? "draft" as const : "published" as const,
    draftScopes
  };
}
