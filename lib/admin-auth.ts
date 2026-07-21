import { createHmac, timingSafeEqual } from "crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE_NAME,
  type SessionPayload,
  verifyAdminSessionToken
} from "@/lib/admin-session";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function getRequiredEnv() {
  const clean = (val?: string) => {
    if (!val) return "";
    return val.trim().replace(/^['"](.*)['"]$/, '$1');
  };

  const username = clean(process.env.ADMIN_USERNAME);
  const password = clean(process.env.ADMIN_PASSWORD);
  const secret = clean(process.env.SESSION_SECRET);

  return {
    username,
    password,
    secret,
    missing: [
      !username ? "ADMIN_USERNAME" : null,
      !password ? "ADMIN_PASSWORD" : null,
      !secret ? "SESSION_SECRET" : null
    ].filter(Boolean) as string[]
  };
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function encodeSession(payload: SessionPayload, secret: string) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(body, secret);
  return `${body}.${signature}`;
}

export function getAdminEnvStatus() {
  const env = getRequiredEnv();
  return {
    configured: env.missing.length === 0,
    missing: env.missing
  };
}

export async function loginAdmin(username: string, password: string) {
  const env = getRequiredEnv();
  if (env.missing.length > 0 || !env.username || !env.password || !env.secret) {
    throw new Error(`Missing admin auth env: ${env.missing.join(", ")}`);
  }

  if (!safeEqual(username, env.username) || !safeEqual(password, env.password)) {
    return false;
  }

  const cookieStore = await cookies();
  const token = encodeSession(
    {
      username,
      expiresAt: Date.now() + SESSION_TTL_MS
    },
    env.secret
  );

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + SESSION_TTL_MS)
  });

  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
}

export async function getAdminSession() {
  const env = getRequiredEnv();
  if (!env.secret) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  return verifyAdminSessionToken(token, env.secret);
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminSession());
}

export async function requireAdminUser() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function rejectIfNotAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
