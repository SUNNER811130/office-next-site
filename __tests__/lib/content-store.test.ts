import { promises as fs } from "fs";

import { unstable_noStore as noStore } from "next/cache";

import { readContent, writeContent, updateContentSection, resetContentToSeed, siteContentSeed } from "@/lib/content-store";

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
