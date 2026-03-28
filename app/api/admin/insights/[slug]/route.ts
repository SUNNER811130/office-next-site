import { NextRequest, NextResponse } from "next/server";
import { rejectIfNotAdmin } from "@/lib/admin-auth";
import { updateInsight, deleteInsight } from "@/lib/insights";

type Params = { params: Promise<{ slug: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) return unauthorized;
  const { slug } = await params;

  try {
    const post = await req.json();
    await updateInsight(slug, post);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) return unauthorized;
  const { slug } = await params;

  try {
    await deleteInsight(slug);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
