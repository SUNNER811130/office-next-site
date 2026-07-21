export const ADMIN_SESSION_COOKIE_NAME = "office_next_admin_session";

export type SessionPayload = {
  username: string;
  expiresAt: number;
};

function decodeBase64Url(value: string): Uint8Array | null {
  if (!value || !/^[A-Za-z0-9_-]+$/.test(value) || value.length % 4 === 1) {
    return null;
  }

  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

  try {
    const decoded = atob(padded);
    return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

export async function verifyAdminSessionToken(
  token: string,
  secret: string,
  now: number = Date.now()
): Promise<SessionPayload | null> {
  if (!token || !secret) return null;

  const segments = token.split(".");
  if (segments.length !== 2) return null;

  const [body, encodedSignature] = segments;
  const bodyBytes = decodeBase64Url(body);
  const signature = decodeBase64Url(encodedSignature);
  if (!bodyBytes || !signature) return null;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const validSignature = await crypto.subtle.verify(
      "HMAC",
      key,
      toArrayBuffer(signature),
      new TextEncoder().encode(body)
    );
    if (!validSignature) return null;

    const payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bodyBytes)) as Partial<SessionPayload>;
    if (
      typeof payload.username !== "string" ||
      !payload.username.trim() ||
      typeof payload.expiresAt !== "number" ||
      !Number.isFinite(payload.expiresAt) ||
      now > payload.expiresAt
    ) {
      return null;
    }

    return {
      username: payload.username,
      expiresAt: payload.expiresAt
    };
  } catch {
    return null;
  }
}
