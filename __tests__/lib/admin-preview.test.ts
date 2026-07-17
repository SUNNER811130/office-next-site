import { promises as fs, readFileSync } from "fs";
import os from "os";
import path from "path";

import { siteContentSeed } from "@/data/site-content.seed";
import { readAdminPreview, adminPreviewTargetConfig, isAdminPreviewTarget } from "@/lib/admin-preview";
import { createEnvelopeFromLegacy } from "@/lib/content-envelope";
import { LocalFileContentWorkflowRepository } from "@/lib/content-workflow-repository";
import { isAdminPreviewRequestUrl, mergeVaryHeader } from "@/lib/http-vary";

describe("Admin Draft Preview", () => {
  let directory = "";

  afterEach(async () => {
    if (directory) await fs.rm(directory, { recursive: true, force: true });
    directory = "";
  });

  async function createRepository() {
    directory = await fs.mkdtemp(path.join(os.tmpdir(), "office-next-l6-preview-"));
    const persistencePath = path.join(directory, "site-content.json");
    const envelope = createEnvelopeFromLegacy(siteContentSeed, "2026-07-16T01:00:00.000Z");
    envelope.drafts.home = {
      value: { ...siteContentSeed.home, hero: { ...siteContentSeed.home.hero, title: "Home Draft Title" } },
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-16T02:00:00.000Z"
    };
    envelope.drafts.design = {
      value: { ...siteContentSeed.design, layout: { ...siteContentSeed.design.layout, density: "compact" } },
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-16T02:00:00.000Z"
    };
    envelope.drafts["pageBlocks.services"] = {
      value: siteContentSeed.pageBlocks.services.map((block) => block.id === "faq" ? { ...block, enabled: false } : block),
      revision: 1,
      basedOnPublishedRevision: 1,
      updatedAt: "2026-07-16T02:00:00.000Z"
    };
    await fs.writeFile(persistencePath, JSON.stringify(envelope, null, 2), "utf8");
    return {
      persistencePath,
      repository: new LocalFileContentWorkflowRepository({ persistencePath, seed: siteContentSeed })
    };
  }

  it("uses an explicit target allowlist and rejects arbitrary paths", () => {
    expect(Object.keys(adminPreviewTargetConfig)).toEqual(["home", "services", "about", "contact"]);
    expect(isAdminPreviewTarget("home")).toBe(true);
    expect(isAdminPreviewTarget("../../data/site-content.json")).toBe(false);
  });

  it("composes only target-related Draft scopes and leaves other Page Block Drafts isolated", async () => {
    const fixture = await createRepository();
    const home = await readAdminPreview("home", fixture.repository);

    expect(home.source).toBe("draft");
    expect(home.content.home.hero.title).toBe("Home Draft Title");
    expect(home.content.design.layout.density).toBe("compact");
    expect(home.content.pageBlocks.services).toEqual(siteContentSeed.pageBlocks.services);
    expect(home.content.pageBlocks.home).toEqual(siteContentSeed.pageBlocks.home);
    expect(home.draftScopes).toEqual(expect.arrayContaining(["home", "design"]));
    expect(home.draftScopes).not.toContain("pageBlocks.services");
  });

  it("falls back per scope to Published and does not mutate persistence while previewing", async () => {
    const fixture = await createRepository();
    const before = await fs.readFile(fixture.persistencePath, "utf8");
    const contact = await readAdminPreview("contact", fixture.repository);

    expect(contact.source).toBe("draft");
    expect(contact.content.contact).toEqual(siteContentSeed.contact);
    expect(contact.content.social).toEqual(siteContentSeed.social);
    expect(contact.content.design.layout.density).toBe("compact");
    expect(await fs.readFile(fixture.persistencePath, "utf8")).toBe(before);
  });

  it("keeps route auth, no-store, noindex, safe errors, and public Published reads explicit", () => {
    const route = readFileSync(path.join(process.cwd(), "app/admin/preview/[target]/page.tsx"), "utf8");
    const error = readFileSync(path.join(process.cwd(), "app/admin/preview/[target]/error.tsx"), "utf8");
    const store = readFileSync(path.join(process.cwd(), "lib/content-store.ts"), "utf8");
    const frame = readFileSync(path.join(process.cwd(), "components/admin/preview/admin-preview-frame.tsx"), "utf8");
    const middleware = readFileSync(path.join(process.cwd(), "middleware.ts"), "utf8");
    const instrumentation = readFileSync(path.join(process.cwd(), "instrumentation.ts"), "utf8");

    expect(route.indexOf("await requireAdminUser()")).toBeLessThan(route.indexOf("readAdminPreview(target)"));
    expect(route).toContain("noStore();");
    expect(route).toContain('dynamic = "force-dynamic"');
    expect(route).toContain("robots: { index: false, follow: false }");
    expect(route).toContain("<AdminPreviewSiteShell source={preview.source} content={preview.content}>");
    expect(middleware).toContain('matcher: "/admin/preview/:path*"');
    expect(middleware).toContain('"private, no-store, max-age=0, must-revalidate"');
    expect(middleware).toContain('"X-Robots-Tag", "noindex, nofollow"');
    expect(middleware).toContain('mergeVaryHeader(response.headers.get("Vary"), "Cookie")');
    expect(instrumentation).toContain('isAdminPreviewRequestUrl(this.req?.url)');
    expect(instrumentation).toContain('mergeVaryHeader(serialized, "Cookie")');
    expect(error).not.toContain("error.message");
    expect(store).toContain("repository.readPublished()");
    expect(frame).not.toContain("localStorage");
    expect(frame).not.toContain("draft=");
    expect(route).not.toContain("cookies().set");
    expect(route).not.toContain("saveDraft");
    expect(route).not.toContain("publishDraft");
    expect(route).not.toContain("discardDraft");
  });

  it("merges Vary tokens case-insensitively without duplicates", () => {
    expect(mergeVaryHeader("RSC, Accept-Encoding", "Cookie")).toBe("RSC, Accept-Encoding, Cookie");
    expect(mergeVaryHeader("RSC, cookie", "Cookie")).toBe("RSC, cookie");
    expect(mergeVaryHeader(null, "Cookie")).toBe("Cookie");
  });

  it("limits the final Vary repair to Admin Preview request URLs", () => {
    expect(isAdminPreviewRequestUrl("/admin/preview/home")).toBe(true);
    expect(isAdminPreviewRequestUrl("/admin/preview/home?from=admin")).toBe(true);
    expect(isAdminPreviewRequestUrl("/admin/preview")).toBe(false);
    expect(isAdminPreviewRequestUrl("/admin/home")).toBe(false);
    expect(isAdminPreviewRequestUrl("/about")).toBe(false);
    expect(isAdminPreviewRequestUrl(undefined)).toBe(false);
  });
});
