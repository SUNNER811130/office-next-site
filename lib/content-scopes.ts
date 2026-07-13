import { normalizeDesignSettings } from "@/lib/design-settings";
import {
  normalizeAboutBlocks,
  normalizeContactBlocks,
  normalizeHomeBlocks,
  normalizeServicesBlocks
} from "@/lib/page-block-settings";
import type { SiteContent } from "@/types/content";
import type { ContentScope, ScopeValue, ScopeValueMap } from "@/types/content-workflow";

export const contentScopes = [
  "brand",
  "home",
  "founder",
  "services",
  "cases",
  "testimonials",
  "faq",
  "contact",
  "social",
  "design",
  "pageBlocks.home",
  "pageBlocks.services",
  "pageBlocks.about",
  "pageBlocks.contact"
] as const satisfies readonly ContentScope[];

const contentScopeSet: ReadonlySet<string> = new Set(contentScopes);

export function isContentScope(value: unknown): value is ContentScope {
  return typeof value === "string" && contentScopeSet.has(value);
}

export function assertContentScope(value: unknown): asserts value is ContentScope {
  if (!isContentScope(value)) {
    throw new Error(`Unknown content scope: ${String(value)}`);
  }
}

type ScopeAccessorRegistry = {
  [TScope in ContentScope]: (content: SiteContent) => ScopeValue<TScope>;
};

const scopeAccessors = {
  brand: (content) => content.brand,
  home: (content) => content.home,
  founder: (content) => content.founder,
  services: (content) => content.services,
  cases: (content) => content.cases,
  testimonials: (content) => content.testimonials,
  faq: (content) => content.faq,
  contact: (content) => content.contact,
  social: (content) => content.social,
  design: (content) => content.design,
  "pageBlocks.home": (content) => content.pageBlocks.home,
  "pageBlocks.services": (content) => content.pageBlocks.services,
  "pageBlocks.about": (content) => content.pageBlocks.about,
  "pageBlocks.contact": (content) => content.pageBlocks.contact
} satisfies ScopeAccessorRegistry;

export function getScopeValue<TScope extends ContentScope>(
  content: SiteContent,
  scope: TScope
): ScopeValue<TScope> {
  const accessor = scopeAccessors[scope] as (source: SiteContent) => ScopeValue<TScope>;
  return accessor(content);
}

type ScopeMergerRegistry = {
  [TScope in ContentScope]: (content: SiteContent, value: ScopeValue<TScope>) => SiteContent;
};

const scopeMergers = {
  brand: (content, value) => ({ ...content, brand: value }),
  home: (content, value) => ({ ...content, home: value }),
  founder: (content, value) => ({ ...content, founder: value }),
  services: (content, value) => ({ ...content, services: value }),
  cases: (content, value) => ({ ...content, cases: value }),
  testimonials: (content, value) => ({ ...content, testimonials: value }),
  faq: (content, value) => ({ ...content, faq: value }),
  contact: (content, value) => ({ ...content, contact: value }),
  social: (content, value) => ({ ...content, social: value }),
  design: (content, value) => ({ ...content, design: value }),
  "pageBlocks.home": (content, value) => ({
    ...content,
    pageBlocks: { ...content.pageBlocks, home: value }
  }),
  "pageBlocks.services": (content, value) => ({
    ...content,
    pageBlocks: { ...content.pageBlocks, services: value }
  }),
  "pageBlocks.about": (content, value) => ({
    ...content,
    pageBlocks: { ...content.pageBlocks, about: value }
  }),
  "pageBlocks.contact": (content, value) => ({
    ...content,
    pageBlocks: { ...content.pageBlocks, contact: value }
  })
} satisfies ScopeMergerRegistry;

export function mergeScopeValue<TScope extends ContentScope>(
  content: SiteContent,
  scope: TScope,
  value: ScopeValue<TScope>
): SiteContent {
  const merger = scopeMergers[scope] as (
    source: SiteContent,
    scopeValue: ScopeValue<TScope>
  ) => SiteContent;
  return merger(content, value);
}

type ScopeNormalizerRegistry = {
  [TScope in ContentScope]: (value: unknown) => ScopeValue<TScope>;
};

const preserve = <TValue>(value: unknown) => value as TValue;

const scopeNormalizers = {
  brand: preserve<ScopeValueMap["brand"]>,
  home: preserve<ScopeValueMap["home"]>,
  founder: preserve<ScopeValueMap["founder"]>,
  services: preserve<ScopeValueMap["services"]>,
  cases: preserve<ScopeValueMap["cases"]>,
  testimonials: preserve<ScopeValueMap["testimonials"]>,
  faq: preserve<ScopeValueMap["faq"]>,
  contact: preserve<ScopeValueMap["contact"]>,
  social: preserve<ScopeValueMap["social"]>,
  design: normalizeDesignSettings,
  "pageBlocks.home": normalizeHomeBlocks,
  "pageBlocks.services": normalizeServicesBlocks,
  "pageBlocks.about": normalizeAboutBlocks,
  "pageBlocks.contact": normalizeContactBlocks
} satisfies ScopeNormalizerRegistry;

export function normalizeScopeValue<TScope extends ContentScope>(
  scope: TScope,
  value: unknown
): ScopeValue<TScope> {
  const normalizer = scopeNormalizers[scope] as (input: unknown) => ScopeValue<TScope>;
  return normalizer(value);
}
