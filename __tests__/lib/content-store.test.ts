import { promises as fs } from "fs";

import { unstable_noStore as noStore } from "next/cache";

import { readContent, writeContent, updateContentSection, updatePageBlockPage, resetContentToSeed, siteContentSeed } from "@/lib/content-store";

jest.mock("fs", () => ({
  promises: {
    mkdir: jest.fn(),
    access: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
  }
}));

jest.mock("next/cache", () => ({
  unstable_noStore: jest.fn(),
}));

describe("Content Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockContent = { ...siteContentSeed, brand: { ...siteContentSeed.brand, name: "Test Brand" } };

  it("should read content from file", async () => {
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockContent));

    const content = await readContent();

    expect(noStore).toHaveBeenCalled();
    expect(fs.mkdir).toHaveBeenCalled();
    expect(fs.access).toHaveBeenCalled();
    expect(content.brand.name).toBe("Test Brand");
  });

  it("uses design defaults when an older JSON file has no design section", async () => {
    const { design: _design, ...legacyContent } = mockContent;
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(legacyContent));
    const content = await readContent();
    expect(content.design).toEqual(siteContentSeed.design);
  });

  it("uses page block defaults when an older JSON file has no pageBlocks section", async () => {
    const { pageBlocks: _pageBlocks, ...legacyContent } = mockContent;
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(legacyContent));
    const content = await readContent();
    expect(content.pageBlocks).toEqual(siteContentSeed.pageBlocks);
  });

  it("normalizes page blocks before storing them", async () => {
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockContent));
    const nextContent = await updateContentSection("pageBlocks", { ...siteContentSeed.pageBlocks, home: [
      { ...siteContentSeed.pageBlocks.home[0], enabled: false, order: 99 },
      { ...siteContentSeed.pageBlocks.home[1], background: "unsafe" as "default" }
    ] });
    expect(nextContent.pageBlocks.home[0]).toEqual(expect.objectContaining({ id: "hero", enabled: true, order: 0 }));
    expect(nextContent.pageBlocks.home.find((block) => block.id === "work-upgrade")?.background).toBe("default");
    const stored = JSON.parse((fs.writeFile as jest.Mock).mock.calls.at(-1)?.[1] as string);
    expect(stored.pageBlocks.home).toHaveLength(siteContentSeed.pageBlocks.home.length);
  });

  it("updates services blocks while preserving the latest home settings", async () => {
    const latest = { ...mockContent, pageBlocks: { ...mockContent.pageBlocks, home: mockContent.pageBlocks.home.map((block) => block.id === "faq" ? { ...block, enabled: false } : block) } };
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(latest));
    const next = await updatePageBlockPage("services", [{ ...siteContentSeed.pageBlocks.services[0] }]);
    expect(next.pageBlocks.home.find((block) => block.id === "faq")?.enabled).toBe(false);
    expect(next.pageBlocks.services).toHaveLength(siteContentSeed.pageBlocks.services.length);
  });

  it("updates home blocks while preserving the latest services settings", async () => {
    const latest = { ...mockContent, pageBlocks: { ...mockContent.pageBlocks, services: mockContent.pageBlocks.services.map((block) => block.id === "faq" ? { ...block, enabled: false } : block) } };
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(latest));
    const next = await updatePageBlockPage("home", siteContentSeed.pageBlocks.home);
    expect(next.pageBlocks.services.find((block) => block.id === "faq")?.enabled).toBe(false);
  });

  it("resets services defaults without changing home", async () => {
    const latest = { ...mockContent, pageBlocks: { ...mockContent.pageBlocks, home: mockContent.pageBlocks.home.map((block) => block.id === "faq" ? { ...block, enabled: false } : block) } };
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(latest));
    const next = await updatePageBlockPage("services", siteContentSeed.pageBlocks.services);
    expect(next.pageBlocks.home.find((block) => block.id === "faq")?.enabled).toBe(false);
    expect(next.pageBlocks.services).toEqual(siteContentSeed.pageBlocks.services);
  });

  it("normalizes the design section before storing it", async () => {
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockContent));
    const nextContent = await updateContentSection("design", {
      ...siteContentSeed.design,
      layout: { ...siteContentSeed.design.layout, desktopContainer: 9999 as 1400 }
    });
    expect(nextContent.design.layout.desktopContainer).toBe(1400);
    const stored = (fs.writeFile as jest.Mock).mock.calls.at(-1)?.[1] as string;
    expect(JSON.parse(stored).design.layout.desktopContainer).toBe(1400);
  });

  it("should write content to file", async () => {
    await writeContent(mockContent);

    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(mockContent, null, 2),
      "utf8"
    );
  });

  it("should update specific section", async () => {
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockContent));
    
    const nextContent = await updateContentSection("brand", {
      ...siteContentSeed.brand,
      name: "Updated Test Brand"
    });

    expect(nextContent.brand.name).toBe("Updated Test Brand");
    expect(fs.writeFile).toHaveBeenCalled();
  });

  it("should reset to seed", async () => {
    await resetContentToSeed();
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(siteContentSeed, null, 2),
      "utf8"
    );
  });
});
