import { createHmac } from "crypto";
import { readFileSync } from "fs";
import path from "path";

import { NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE_NAME } from "@/lib/admin-session";
import { config, middleware } from "@/middleware";

const secret = "middleware-test-secret";
const originalSecret = process.env.SESSION_SECRET;

function sessionToken(expiresAt: number, signingSecret: string = secret) {
  const body = Buffer.from(JSON.stringify({ username: "admin", expiresAt })).toString("base64url");
  const signature = createHmac("sha256", signingSecret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function request(token?: string) {
  const headers = new Headers();
  if (token) headers.set("Cookie", `${ADMIN_SESSION_COOKIE_NAME}=${token}`);
  return new NextRequest("https://example.test/admin/preview/home", { headers });
}

function expectSecurityHeaders(response: Response) {
  expect(response.headers.get("Cache-Control")).toBe("private, no-store, max-age=0, must-revalidate");
  expect(response.headers.get("Pragma")).toBe("no-cache");
  expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  expect(response.headers.get("Vary")?.split(/,\s*/)).toContain("Cookie");
}

describe("Admin Preview pre-render middleware authentication", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = secret;
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = originalSecret;
  });

  it.each([
    ["missing cookie", undefined],
    ["invalid cookie", sessionToken(Date.now() + 60_000, "wrong-secret")],
    ["expired cookie", sessionToken(Date.now() - 60_000)]
  ])("redirects %s before rendering", async (_label, token) => {
    const response = await middleware(request(token));

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe("https://example.test/admin/login");
    expectSecurityHeaders(response);
  });

  it("allows a valid session and applies the same security headers", async () => {
    const response = await middleware(request(sessionToken(Date.now() + 60_000)));

    expect(response.headers.get("x-middleware-next")).toBe("1");
    expectSecurityHeaders(response);
  });

  it("matches only Admin Preview and keeps page auth as defense-in-depth", () => {
    const middlewareSource = readFileSync(path.join(process.cwd(), "middleware.ts"), "utf8");
    const pageSource = readFileSync(path.join(process.cwd(), "app/admin/preview/[target]/page.tsx"), "utf8");

    expect(config.matcher).toBe("/admin/preview/:path*");
    expect(config.matcher).not.toMatch(/^\/$|services|about|contact/);
    expect(pageSource).toContain("await requireAdminUser()");
    expect(pageSource.indexOf("await requireAdminUser()")).toBeLessThan(pageSource.indexOf("readAdminPreview(target)"));
    expect(middlewareSource).not.toContain("readAdminPreview");
    expect(middlewareSource).not.toContain("readContent");
    expect(middlewareSource).not.toContain("rawEnvelope");
    expect(middlewareSource).not.toContain("localStorage");
    expect(middlewareSource).not.toContain("draft=");
  });
});
