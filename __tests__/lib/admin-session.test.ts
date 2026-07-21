import { createHmac } from "crypto";
import { readFileSync } from "fs";
import path from "path";

import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-session";

const secret = "test-session-secret";
const now = 1_800_000_000_000;

function encodeLegacySession(payloadText: string, signingSecret: string = secret) {
  const body = Buffer.from(payloadText).toString("base64url");
  const signature = createHmac("sha256", signingSecret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

describe("Edge-compatible admin session verifier", () => {
  it("verifies the existing login token format and returns a valid session", async () => {
    const token = encodeLegacySession(JSON.stringify({ username: "admin", expiresAt: now + 60_000 }));

    await expect(verifyAdminSessionToken(token, secret, now)).resolves.toEqual({
      username: "admin",
      expiresAt: now + 60_000
    });
    expect(ADMIN_SESSION_COOKIE_NAME).toBe("office_next_admin_session");
  });

  it.each([
    ["missing token", "", secret],
    ["missing secret", encodeLegacySession(JSON.stringify({ username: "admin", expiresAt: now + 60_000 })), ""],
    ["malformed token", "not-a-session", secret],
    ["invalid base64url", "%%%.%%%", secret],
    ["invalid signature", encodeLegacySession(JSON.stringify({ username: "admin", expiresAt: now + 60_000 }), "other-secret"), secret],
    ["malformed JSON", encodeLegacySession("not-json"), secret],
    ["missing username", encodeLegacySession(JSON.stringify({ expiresAt: now + 60_000 })), secret],
    ["missing expiresAt", encodeLegacySession(JSON.stringify({ username: "admin" })), secret],
    ["expired session", encodeLegacySession(JSON.stringify({ username: "admin", expiresAt: now - 1 })), secret]
  ])("rejects %s", async (_label, token, signingSecret) => {
    await expect(verifyAdminSessionToken(token, signingSecret, now)).resolves.toBeNull();
  });

  it("has no Node-only dependency in the Edge verifier module", () => {
    const source = readFileSync(path.join(process.cwd(), "lib/admin-session.ts"), "utf8");

    expect(source).not.toMatch(/from ["'](?:node:)?crypto["']/);
    expect(source).not.toContain("createHmac");
    expect(source).not.toContain("timingSafeEqual");
    expect(source).not.toMatch(/\bBuffer(?:\.|\()/);
    expect(source).not.toContain("next/headers");
    expect(source).not.toMatch(/from ["'](?:node:)?fs["']/);
    expect(source).not.toMatch(/from ["'](?:node:)?path["']/);
  });
});
