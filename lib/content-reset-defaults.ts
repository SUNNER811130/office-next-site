import { designSettingsDefaults } from "@/lib/design-settings";
import { pageBlockSettingsDefaults } from "@/lib/page-block-settings";
import { ContentWorkflowRequestError } from "@/lib/content-workflow-request";
import type { ContentScope, ScopeValue } from "@/types/content-workflow";

export type ResettableContentScope =
  | "design"
  | "pageBlocks.home"
  | "pageBlocks.services"
  | "pageBlocks.about"
  | "pageBlocks.contact";

const resettableScopeSet: ReadonlySet<ContentScope> = new Set([
  "design",
  "pageBlocks.home",
  "pageBlocks.services",
  "pageBlocks.about",
  "pageBlocks.contact"
]);

const resetDefaults = {
  design: designSettingsDefaults,
  "pageBlocks.home": pageBlockSettingsDefaults.home,
  "pageBlocks.services": pageBlockSettingsDefaults.services,
  "pageBlocks.about": pageBlockSettingsDefaults.about,
  "pageBlocks.contact": pageBlockSettingsDefaults.contact
} satisfies { [TScope in ResettableContentScope]: ScopeValue<TScope> };

export function isResettableContentScope(
  scope: ContentScope
): scope is ResettableContentScope {
  return resettableScopeSet.has(scope);
}

export function resolveContentResetDefaults<TScope extends ContentScope>(
  scope: TScope
): ScopeValue<TScope> {
  if (!isResettableContentScope(scope)) {
    throw new ContentWorkflowRequestError("NOT_FOUND", "Reset is unavailable for this scope");
  }
  return structuredClone(resetDefaults[scope]) as ScopeValue<TScope>;
}
