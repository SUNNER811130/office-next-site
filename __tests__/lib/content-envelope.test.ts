import { siteContentSeed } from "@/data/site-content.seed";
import {
  ContentWorkflowSchemaError,
  MalformedContentEnvelopeError,
  UnknownContentSchemaVersionError,
  contentEnvelopeHasDrafts,
  createEditorSnapshot,
  createEnvelopeFromLegacy,
  createPreviewContent,
  isContentEnvelopeV1,
  isLegacySiteContent,
  parseContentEnvelope,
  parseContentEnvelopeV1,
  readPublishedSnapshot
} from "@/lib/content-envelope";
import type { ContentEnvelopeV1 } from "@/types/content-workflow";

const baseline = "2026-07-13T00:00:00.000Z";
const draftTime = "2026-07-13T01:00:00.000Z";

function legacyEnvelope(): ContentEnvelopeV1 {
  return createEnvelopeFromLegacy(siteContentSeed, baseline);
}

describe("Content envelope parser and composition", () => {
  it("identifies legacy SiteContent without workflow fields", () => {
    expect(isLegacySiteContent(siteContentSeed)).toBe(true);
    expect(isLegacySiteContent({ schemaVersion: 1 })).toBe(false);
    expect(isLegacySiteContent({ published: {} })).toBe(false);
  });

  it("migrates legacy content into an in-memory v1 envelope", () => {
    const envelope = createEnvelopeFromLegacy(siteContentSeed, baseline);

    expect(envelope.schemaVersion).toBe(1);
    expect(envelope.published.content).toEqual(siteContentSeed);
    expect(envelope.published.revision).toBe(1);
    expect(Object.values(envelope.published.scopeRevisions).every((revision) => revision === 1)).toBe(true);
    expect(Object.values(envelope.published.scopeUpdatedAt).every((timestamp) => timestamp === baseline)).toBe(true);
    expect(envelope.drafts).toEqual({});
  });

  it("uses design defaults for legacy content without design", () => {
    const { design: _design, ...legacy } = siteContentSeed;
    expect(createEnvelopeFromLegacy(legacy, baseline).published.content.design).toEqual(siteContentSeed.design);
  });

  it("uses page block defaults for legacy content without pageBlocks", () => {
    const { pageBlocks: _pageBlocks, ...legacy } = siteContentSeed;
    expect(createEnvelopeFromLegacy(legacy, baseline).published.content.pageBlocks).toEqual(siteContentSeed.pageBlocks);
  });

  it("parses a valid v1 envelope and reads Published", () => {
    const source = legacyEnvelope();
    const parsed = parseContentEnvelopeV1(source);

    expect(isContentEnvelopeV1(source)).toBe(true);
    expect(readPublishedSnapshot(parsed).content).toEqual(siteContentSeed);
  });

  it("rejects an unknown schema version without legacy downgrade", () => {
    expect(() => parseContentEnvelope({ schemaVersion: 2, published: {}, drafts: {} })).toThrow(
      UnknownContentSchemaVersionError
    );
    expect(() => parseContentEnvelope({ schemaVersion: 2, published: {}, drafts: {} })).toThrow(
      "Unknown content workflow schema version: 2"
    );
  });

  it.each([
    { schemaVersion: 1 },
    { schemaVersion: 1, published: {}, drafts: {} },
    { published: {}, drafts: {} },
    []
  ])("rejects malformed envelope input: %p", (value) => {
    expect(() => parseContentEnvelope(value)).toThrow(ContentWorkflowSchemaError);
  });

  it("distinguishes malformed envelope errors", () => {
    expect(() => parseContentEnvelope({ schemaVersion: 1 })).toThrow(MalformedContentEnvelopeError);
  });

  it("rejects unknown draft scopes", () => {
    const source = legacyEnvelope();
    expect(() => parseContentEnvelopeV1({
      ...source,
      drafts: {
        "pageBlocks.home.hero": {
          value: [],
          revision: 1,
          basedOnPublishedRevision: 1,
          updatedAt: draftTime
        }
      }
    })).toThrow("unknown draft scope");
  });

  it("composes an EditorSnapshot from Draft before Published", () => {
    const envelope = legacyEnvelope();
    envelope.drafts.brand = {
      value: { ...siteContentSeed.brand, name: "Draft Brand" },
      revision: 2,
      basedOnPublishedRevision: 1,
      updatedAt: draftTime
    };
    envelope.published.scopeUpdatedAt.brand = "2026-07-12T10:00:00.000Z";
    envelope.published.updatedAt = "2026-07-13T05:00:00.000Z";

    const snapshot = createEditorSnapshot(envelope, "brand");
    expect(snapshot.data.name).toBe("Draft Brand");
    expect(snapshot.source).toBe("draft");
    expect(snapshot.draftRevision).toBe(2);
    expect(snapshot.publishedUpdatedAt).toBe("2026-07-12T10:00:00.000Z");
    expect(snapshot.publishedUpdatedAt).not.toBe(envelope.published.updatedAt);
  });

  it("composes an EditorSnapshot from Published when no Draft exists", () => {
    const snapshot = createEditorSnapshot(legacyEnvelope(), "home");
    expect(snapshot.data).toEqual(siteContentSeed.home);
    expect(snapshot.source).toBe("published");
    expect(snapshot.draftRevision).toBeNull();
    expect(snapshot.draftUpdatedAt).toBeNull();
  });

  it("previews only the requested Draft scope", () => {
    const envelope = legacyEnvelope();
    envelope.drafts.brand = {
      value: { ...siteContentSeed.brand, name: "Preview Brand" },
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: draftTime
    };
    envelope.drafts.home = {
      value: { ...siteContentSeed.home, hero: { ...siteContentSeed.home.hero, title: "Other Draft" } },
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: draftTime
    };

    const preview = createPreviewContent(envelope, "brand");
    expect(preview.brand.name).toBe("Preview Brand");
    expect(preview.home).toEqual(siteContentSeed.home);
  });

  it("reports whether any allowlisted Draft exists", () => {
    const envelope = legacyEnvelope();
    expect(contentEnvelopeHasDrafts(envelope)).toBe(false);
    envelope.drafts.contact = {
      value: siteContentSeed.contact,
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: draftTime
    };
    expect(contentEnvelopeHasDrafts(envelope)).toBe(true);
  });

  it("normalizes a design Draft while parsing v1", () => {
    const source = legacyEnvelope();
    const parsed = parseContentEnvelopeV1({
      ...source,
      drafts: {
        design: {
          value: {
            ...siteContentSeed.design,
            layout: { ...siteContentSeed.design.layout, desktopContainer: 9999 }
          },
          revision: 1,
          basedOnPublishedRevision: 1,
          updatedAt: draftTime
        }
      }
    });
    expect(parsed.drafts.design?.value.layout.desktopContainer).toBe(
      siteContentSeed.design.layout.desktopContainer
    );
  });

  it("normalizes a Page Block Draft without weakening hero rules", () => {
    const source = legacyEnvelope();
    const parsed = parseContentEnvelopeV1({
      ...source,
      drafts: {
        "pageBlocks.home": {
          value: [{
            ...siteContentSeed.pageBlocks.home[0],
            enabled: false,
            order: 99,
            layout: "single-column"
          }],
          revision: 1,
          basedOnPublishedRevision: 1,
          updatedAt: draftTime
        }
      }
    });
    expect(parsed.drafts["pageBlocks.home"]?.value[0]).toEqual(expect.objectContaining({
      id: "hero",
      enabled: true,
      order: 0,
      layout: "default"
    }));
    expect(parsed.published.content.pageBlocks.services).toEqual(siteContentSeed.pageBlocks.services);
  });
});
