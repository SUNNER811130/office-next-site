import { createPageMetadata, JsonLd, createOrganizationSchema, createArticleSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

jest.mock("@/lib/site", () => ({
  absoluteUrl: (path: string) => `https://test.com${path}`,
  siteConfig: {
    shortName: "TestSite",
    name: "Test Site Inc.",
    url: "https://test.com",
    contactEmail: "test@example.com",
    description: "A test description",
    ogImage: "https://test.com/og.png",
  },
  brandEntity: {
    proposition: "Test Prop",
    sameAs: [],
    founder: { name: "Test Founder", role: "CEO" }
  }
}));

describe("SEO Utilities", () => {
  it("should generate proper page metadata", () => {
    const metadata = createPageMetadata({
      path: "/about",
      title: "About Us",
      description: "About our test company",
      keywords: ["test", "about"]
    });

    expect(metadata.title).toBe("About Us");
    expect(metadata.description).toBe("About our test company");
    expect(metadata.keywords).toEqual(["test", "about"]);
    expect(metadata.openGraph?.url).toBe("https://test.com/about");
    expect(metadata.openGraph?.title).toBe("About Us | TestSite");
  });

  it("should generate correct organization schema", () => {
    const schema = createOrganizationSchema();
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe("Test Site Inc.");
    expect(schema.founder?.name).toBe("Test Founder");
  });

  it("should generate correct article schema", () => {
    const schema = createArticleSchema({
      path: "/blog/post",
      title: "Test Post",
      description: "Post desc",
      publishedAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
      author: "Test Author"
    });

    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe("Test Post");
    expect(schema.author.name).toBe("Test Author");
  });
});
