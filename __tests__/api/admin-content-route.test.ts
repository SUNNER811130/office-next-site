import { NextRequest, NextResponse } from "next/server";

import { GET, PUT } from "@/app/api/admin/content/[section]/route";
import { rejectIfNotAdmin } from "@/lib/admin-auth";
import { readContent, updateContentSection, updatePageBlockPage } from "@/lib/content-store";
import { LegacyContentWriteBlockedError } from "@/lib/content-workflow-errors";
import { siteContentSeed } from "@/data/site-content.seed";

jest.mock("@/lib/admin-auth", () => ({ rejectIfNotAdmin: jest.fn() }));
jest.mock("@/lib/content-store", () => ({
  readContent: jest.fn(),
  updateContentSection: jest.fn(),
  updatePageBlockPage: jest.fn()
}));

describe("admin design content API", () => {
  beforeEach(() => jest.clearAllMocks());

  it("keeps the authenticated legacy GET success payload unchanged", async () => {
    (rejectIfNotAdmin as jest.Mock).mockResolvedValue(null);
    (readContent as jest.Mock).mockResolvedValue(siteContentSeed);

    const response = await GET(
      new NextRequest("http://localhost/api/admin/content/home"),
      { params: Promise.resolve({ section: "home" }) }
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ data: siteContentSeed.home });
  });

  it("keeps the unauthenticated legacy GET behavior unchanged", async () => {
    (rejectIfNotAdmin as jest.Mock).mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );

    const response = await GET(
      new NextRequest("http://localhost/api/admin/content/home"),
      { params: Promise.resolve({ section: "home" }) }
    );

    expect(response.status).toBe(401);
    expect(readContent).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("rejects unauthenticated writes", async () => {
    (rejectIfNotAdmin as jest.Mock).mockResolvedValue(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    const request = new NextRequest("http://localhost/api/admin/content/design", {
      method: "PUT",
      body: JSON.stringify(siteContentSeed.design)
    });
    const response = await PUT(request, { params: Promise.resolve({ section: "design" }) });
    expect(response.status).toBe(401);
    expect(updateContentSection).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated page block writes", async () => {
    (rejectIfNotAdmin as jest.Mock).mockResolvedValue(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    const request = new NextRequest("http://localhost/api/admin/content/pageBlocks", { method: "PUT", body: JSON.stringify({ page: "about", blocks: siteContentSeed.pageBlocks.about }) });
    const response = await PUT(request, { params: Promise.resolve({ section: "pageBlocks" }) });
    expect(response.status).toBe(401);
    expect(updateContentSection).not.toHaveBeenCalled();
  });

  it("stores and returns normalized page blocks for an authenticated admin", async () => {
    (rejectIfNotAdmin as jest.Mock).mockResolvedValue(null);
    (updateContentSection as jest.Mock).mockResolvedValue(siteContentSeed);
    const request = new NextRequest("http://localhost/api/admin/content/pageBlocks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(siteContentSeed.pageBlocks) });
    const response = await PUT(request, { params: Promise.resolve({ section: "pageBlocks" }) });
    expect(updateContentSection).toHaveBeenCalledWith("pageBlocks", siteContentSeed.pageBlocks);
    await expect(response.json()).resolves.toEqual({ ok: true, data: siteContentSeed.pageBlocks });
  });

  it("stores a nested services update without using whole-section replacement", async () => {
    (rejectIfNotAdmin as jest.Mock).mockResolvedValue(null);
    (updatePageBlockPage as jest.Mock).mockResolvedValue(siteContentSeed);
    const payload = { page: "services", blocks: siteContentSeed.pageBlocks.services };
    const request = new NextRequest("http://localhost/api/admin/content/pageBlocks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const response = await PUT(request, { params: Promise.resolve({ section: "pageBlocks" }) });
    expect(updatePageBlockPage).toHaveBeenCalledWith("services", payload.blocks);
    expect(updateContentSection).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ ok: true, data: siteContentSeed.pageBlocks });
  });

  it("stores a nested about update without using whole-section replacement", async () => {
    (rejectIfNotAdmin as jest.Mock).mockResolvedValue(null);
    (updatePageBlockPage as jest.Mock).mockResolvedValue(siteContentSeed);
    const payload = { page: "about", blocks: siteContentSeed.pageBlocks.about };
    const request = new NextRequest("http://localhost/api/admin/content/pageBlocks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const response = await PUT(request, { params: Promise.resolve({ section: "pageBlocks" }) });
    expect(updatePageBlockPage).toHaveBeenCalledWith("about", payload.blocks);
    expect(updateContentSection).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ ok: true, data: siteContentSeed.pageBlocks });
  });

  it("rejects an unauthenticated nested contact update", async () => {
    (rejectIfNotAdmin as jest.Mock).mockResolvedValue(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    const request = new NextRequest("http://localhost/api/admin/content/pageBlocks", { method: "PUT", body: JSON.stringify({ page: "contact", blocks: siteContentSeed.pageBlocks.contact }) });
    const response = await PUT(request, { params: Promise.resolve({ section: "pageBlocks" }) });
    expect(response.status).toBe(401);
    expect(updatePageBlockPage).not.toHaveBeenCalled();
  });

  it("stores a nested contact update without using whole-section replacement", async () => {
    (rejectIfNotAdmin as jest.Mock).mockResolvedValue(null);
    (updatePageBlockPage as jest.Mock).mockResolvedValue(siteContentSeed);
    const payload = { page: "contact", blocks: siteContentSeed.pageBlocks.contact };
    const request = new NextRequest("http://localhost/api/admin/content/pageBlocks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const response = await PUT(request, { params: Promise.resolve({ section: "pageBlocks" }) });
    expect(updatePageBlockPage).toHaveBeenCalledWith("contact", payload.blocks);
    expect(updateContentSection).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ ok: true, data: siteContentSeed.pageBlocks });
  });

  it("stores and returns the design section for an authenticated admin", async () => {
    (rejectIfNotAdmin as jest.Mock).mockResolvedValue(null);
    (updateContentSection as jest.Mock).mockResolvedValue(siteContentSeed);
    const request = new NextRequest("http://localhost/api/admin/content/design", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteContentSeed.design)
    });
    const response = await PUT(request, { params: Promise.resolve({ section: "design" }) });
    expect(response.status).toBe(200);
    expect(updateContentSection).toHaveBeenCalledWith("design", siteContentSeed.design);
    await expect(response.json()).resolves.toEqual({ ok: true, data: siteContentSeed.design });
  });

  it("maps an Envelope legacy write block to a safe 409 without changing success contracts", async () => {
    (rejectIfNotAdmin as jest.Mock).mockResolvedValue(null);
    (updateContentSection as jest.Mock).mockRejectedValue(new LegacyContentWriteBlockedError());
    const request = new NextRequest("http://localhost/api/admin/content/home", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteContentSeed.home)
    });

    const response = await PUT(request, { params: Promise.resolve({ section: "home" }) });

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: {
        code: "LEGACY_WRITE_BLOCKED",
        message: "Legacy content write is blocked after workflow migration"
      }
    });
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
});
