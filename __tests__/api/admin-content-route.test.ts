import { NextRequest, NextResponse } from "next/server";

import { PUT } from "@/app/api/admin/content/[section]/route";
import { rejectIfNotAdmin } from "@/lib/admin-auth";
import { updateContentSection } from "@/lib/content-store";
import { siteContentSeed } from "@/data/site-content.seed";

jest.mock("@/lib/admin-auth", () => ({ rejectIfNotAdmin: jest.fn() }));
jest.mock("@/lib/content-store", () => ({
  readContent: jest.fn(),
  updateContentSection: jest.fn()
}));

describe("admin design content API", () => {
  beforeEach(() => jest.clearAllMocks());

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
});
