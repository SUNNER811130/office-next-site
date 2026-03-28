import { NextRequest, NextResponse } from "next/server";
import { rejectIfNotAdmin } from "@/lib/admin-auth";
import { updateCase, deleteCase } from "@/lib/cases";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const unauthorized = await rejectIfNotAdmin();
  const { slug } = await params;
  if (unauthorized) return unauthorized;

  try {
    const post = await req.json();
    await updateCase(slug, post);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const unauthorized = await rejectIfNotAdmin();
  const { slug } = await params;
  if (unauthorized) return unauthorized;

  try {
    await deleteCase(slug);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
