import { NextRequest, NextResponse } from "next/server";
import { rejectIfNotAdmin } from "@/lib/admin-auth";
import { getAllCases, createCase } from "@/lib/cases";

export async function GET() {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) return unauthorized;
  const posts = await getAllCases();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) return unauthorized;

  try {
    const post = await req.json();
    await createCase(post);
    return NextResponse.json({ ok: true, post });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
