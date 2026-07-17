import { readFileSync } from "fs";
import path from "path";
import { renderToStaticMarkup } from "react-dom/server";

import { AdminPreviewSiteShell } from "@/components/admin/preview/admin-preview-site-shell";
import { FooterContent } from "@/components/layout/footer";
import { FloatingCtaContent } from "@/components/layout/floating-cta";
import { HeaderContent } from "@/components/layout/header";
import { siteContentSeed } from "@/data/site-content.seed";
import type { SiteContent } from "@/types/content";

function previewContent(): SiteContent {
  return {
    ...siteContentSeed,
    brand: {
      ...siteContentSeed.brand,
      name: "Draft Brand Chrome",
      summary: "Draft Footer Summary",
      positioning: "Draft Footer Positioning",
      proposition: "Draft Footer Proposition"
    },
    contact: {
      ...siteContentSeed.contact,
      email: "draft-preview@example.com",
      mailtoLabel: "Draft CTA Label"
    },
    social: {
      ...siteContentSeed.social,
      linkedin: "https://example.com/draft-social"
    },
    design: {
      ...siteContentSeed.design,
      layout: { ...siteContentSeed.design.layout, density: "spacious", headerDensity: "compact" },
      floatingCta: { ...siteContentSeed.design.floatingCta, enabled: true }
    }
  };
}

describe("Admin Preview content-driven site chrome", () => {
  it("renders Header, Footer, and Floating CTA from the supplied content", () => {
    const content = previewContent();
    const header = renderToStaticMarkup(<HeaderContent content={content} />);
    const footer = renderToStaticMarkup(<FooterContent content={content} />);
    const cta = renderToStaticMarkup(<FloatingCtaContent content={content} />);

    expect(header).toContain("返回 Draft Brand Chrome 首頁");
    expect(footer).toContain("Draft Footer Summary");
    expect(footer).toContain("Draft Footer Positioning");
    expect(footer).toContain("Draft Footer Proposition");
    expect(footer).toContain("draft-preview@example.com");
    expect(footer).toContain("https://example.com/draft-social");
    expect(cta).toContain("Draft CTA Label");
  });

  it("does not render Floating CTA when supplied Draft design disables it", () => {
    const content = previewContent();
    content.design = {
      ...content.design,
      floatingCta: { ...content.design.floatingCta, enabled: false }
    };
    expect(renderToStaticMarkup(<FloatingCtaContent content={content} />)).toBe("");
  });

  it("wraps the complete Draft chrome in one design and source boundary", () => {
    const html = renderToStaticMarkup(
      <AdminPreviewSiteShell source="draft" content={previewContent()}>
        <p>Draft Page Body</p>
      </AdminPreviewSiteShell>
    );

    expect(html).toContain("data-admin-preview-root");
    expect(html).toContain('data-preview-source="draft"');
    expect(html).toContain('data-design-density="spacious"');
    expect(html).toContain('data-header-density="compact"');
    expect(html).toContain("草稿預覽｜此內容尚未發布");
    expect(html).toContain("Draft Brand Chrome");
    expect(html).toContain("Draft Footer Summary");
    expect(html).toContain("Draft CTA Label");
    expect(html).toContain("Draft Page Body");
    expect(html).toContain("pb-24 lg:pb-0");
  });

  it("uses Published fallback copy and no CTA padding when the supplied content disables CTA", () => {
    const content = previewContent();
    content.design = {
      ...content.design,
      floatingCta: { ...content.design.floatingCta, enabled: false }
    };
    const html = renderToStaticMarkup(
      <AdminPreviewSiteShell source="published" content={content}>
        <p>Published Body</p>
      </AdminPreviewSiteShell>
    );
    expect(html).toContain("已發布版本｜目前沒有草稿");
    expect(html).toContain("flex-1 pb-0");
    expect(html).not.toContain("site-floating-cta");
  });

  it("keeps public wrappers reading Published while Preview uses the pure content components", () => {
    const header = readFileSync(path.join(process.cwd(), "components/layout/header.tsx"), "utf8");
    const footer = readFileSync(path.join(process.cwd(), "components/layout/footer.tsx"), "utf8");
    const cta = readFileSync(path.join(process.cwd(), "components/layout/floating-cta.tsx"), "utf8");
    const shell = readFileSync(path.join(process.cwd(), "components/admin/preview/admin-preview-site-shell.tsx"), "utf8");

    for (const source of [header, footer, cta]) {
      expect(source).toContain("const content = await readContent();");
    }
    expect(shell).toContain("<HeaderContent content={content} />");
    expect(shell).toContain("<FooterContent content={content} />");
    expect(shell).toContain("<FloatingCtaContent content={content} />");
    expect(shell).not.toContain("readContent");
  });

  it("suppresses only outer Published chrome on Admin Preview paths", () => {
    const rootShell = readFileSync(path.join(process.cwd(), "components/layout/root-site-shell.tsx"), "utf8");
    expect(rootShell).toContain('pathname.startsWith("/admin/preview/")');
    expect(rootShell).toContain("isAdminPreview ? null : header");
    expect(rootShell).toContain("isAdminPreview ? null : floatingCta");
    expect(rootShell).toContain("isAdminPreview ? null : footer");
    expect(rootShell).toContain("!isAdminPreview && floatingCtaEnabled");
    expect(rootShell).not.toContain("suppressHydrationWarning");
    expect(rootShell).not.toContain("draft=");
    expect(rootShell).not.toContain("localStorage");
  });

  it("marks only the Founder hero image as priority without changing its source", () => {
    const about = readFileSync(path.join(process.cwd(), "components/public-pages/about-page-content.tsx"), "utf8");
    const founderImageStart = about.indexOf('src={content.founder.heroImageUrl');
    const founderImage = about.slice(founderImageStart, about.indexOf("/>", founderImageStart) + 2);
    expect(founderImage).toContain('src={content.founder.heroImageUrl || "/people/founder-hero.svg"}');
    expect(founderImage).toContain("priority");
    expect(founderImage).toContain("width={1600}");
    expect(founderImage).toContain("height={2000}");
  });
});
