import type { PageBlockSettings, SiteContent } from "@/types/content";

export type Revision = number;

export type ContentScope =
  | "brand"
  | "home"
  | "founder"
  | "services"
  | "cases"
  | "testimonials"
  | "faq"
  | "contact"
  | "social"
  | "design"
  | "pageBlocks.home"
  | "pageBlocks.services"
  | "pageBlocks.about"
  | "pageBlocks.contact";

export type ScopeValueMap = {
  brand: SiteContent["brand"];
  home: SiteContent["home"];
  founder: SiteContent["founder"];
  services: SiteContent["services"];
  cases: SiteContent["cases"];
  testimonials: SiteContent["testimonials"];
  faq: SiteContent["faq"];
  contact: SiteContent["contact"];
  social: SiteContent["social"];
  design: SiteContent["design"];
  "pageBlocks.home": PageBlockSettings["home"];
  "pageBlocks.services": PageBlockSettings["services"];
  "pageBlocks.about": PageBlockSettings["about"];
  "pageBlocks.contact": PageBlockSettings["contact"];
};

export type ScopeValue<TScope extends ContentScope> = ScopeValueMap[TScope];

export type PublishedSnapshot = {
  content: SiteContent;
  revision: Revision;
  updatedAt: string;
  scopeRevisions: Record<ContentScope, Revision>;
  scopeUpdatedAt: Record<ContentScope, string>;
};

export type DraftRecord<TValue> = {
  value: TValue;
  revision: Revision;
  basedOnPublishedRevision: Revision;
  updatedAt: string;
};

export type ContentDrafts = {
  [TScope in ContentScope]?: DraftRecord<ScopeValue<TScope>>;
};

export type ContentEnvelopeV1 = {
  schemaVersion: 1;
  published: PublishedSnapshot;
  drafts: ContentDrafts;
};

export type EditorSnapshot<TScope extends ContentScope> = {
  scope: TScope;
  data: ScopeValue<TScope>;
  source: "draft" | "published";
  draftRevision: Revision | null;
  publishedRevision: Revision;
  draftUpdatedAt: string | null;
  publishedUpdatedAt: string;
};

export type SaveDraftInput<TScope extends ContentScope> = {
  scope: TScope;
  value: ScopeValue<TScope>;
  expectedDraftRevision: Revision | null;
  expectedPublishedRevision: Revision;
};

export type PublishDraftInput<TScope extends ContentScope> = {
  scope: TScope;
  expectedDraftRevision: Revision;
  expectedPublishedRevision: Revision;
};

export type DiscardDraftInput<TScope extends ContentScope> = {
  scope: TScope;
  expectedDraftRevision: Revision;
};

export interface ContentWorkflowRepository {
  readPublished(): Promise<PublishedSnapshot>;
  readEditor<TScope extends ContentScope>(scope: TScope): Promise<EditorSnapshot<TScope>>;
  readPreview(scope: ContentScope): Promise<SiteContent>;
  hasDrafts(): Promise<boolean>;
  saveDraft<TScope extends ContentScope>(input: SaveDraftInput<TScope>): Promise<EditorSnapshot<TScope>>;
  publishDraft<TScope extends ContentScope>(input: PublishDraftInput<TScope>): Promise<EditorSnapshot<TScope>>;
  discardDraft<TScope extends ContentScope>(input: DiscardDraftInput<TScope>): Promise<EditorSnapshot<TScope>>;
}
